/// <reference lib="webworker" />
import {distinctUntilChanged, filter, map, mergeMap, pairwise, scan, withLatestFrom} from 'rxjs/operators';
import * as turf from '@turf/turf';
import {Observable, Subject} from 'rxjs';
import {Feature, FeatureCollection, LineString, Point, Polygon} from 'geojson';
import {Destination, Node} from './store/nodes/nodes.types';
import {ClosestRoute, Route} from './store/route/route.types';
import {lineDistance, lineSlice, lineString, nearestPointOnLine} from '@turf/turf';

interface Action {
  type: string;

  [key: string]: any;
}

type Coords = [number, number];

// Create actions stream
const actions$ = new Subject<Action>();
addEventListener('message', ({data}) => {
  actions$.next(data);
});

// Fetch network
const fetchNetworks: Promise<FeatureCollection> = fetch('./data/networks.json')
  .then(result => result.json());

function fetchNodes(networkIds: number[]): Promise<Node[]> {
  return Promise.all(
    networkIds.map(network =>
      fetch(`./data/nodes_${network}.json`)
        .then(response => response.json())
    )
  )
    .then(fetchResults => [].concat.apply([], fetchResults));
}

function fetchRoutes(networkIds: number[]): Promise<Route[]> {
  return Promise.all(
    networkIds.map(network =>
      fetch(`./data/routes_${network}.json`)
        .then(response => response.json())
    )
  )
    .then((fetchResults: FeatureCollection[]) => [].concat.apply([], fetchResults.map(col => col.features)));
}

function getNearbyNetworks(location: Coords): Promise<number[]> {
  return fetchNetworks
    .then(networks => networks.features
      .filter((feature: Feature<Polygon>) => {
        if (turf.booleanPointInPolygon(location, feature)) {
          return true;
        }
        const vertices = turf.explode(feature);
        const closestVertex = turf.nearest(location, vertices);
        const distance = turf.distance(location, closestVertex, {units: 'meters'});
        return distance < 5000;
      })
      .map(feature => feature.properties.id)
    );
}

function getActiveRoute(routes: Route[], coords: Coords): Route {
  const result = routes
    .map(feature => {
      return {
        route: feature,
        point: nearestPointOnLine(feature.geometry, coords, {units: 'meters'}),
      };
    })
    .sort((a, b) => a.point.properties.dist - b.point.properties.dist)
    .shift();
  return result && result.point.properties.dist < 20 ? result.route : null;
}


function calculateRouteProgress (route: Feature<LineString>, point: Coords) {
  if (!route || !point) {
    return null;
  }
  const slicedLine = lineSlice(route.geometry.coordinates[0], point, lineString(route.geometry.coordinates));
  return lineDistance(slicedLine, {units: 'meters'});
}

function calculateDestinationAndProgress (
  route: Route,
  prevPoint: Coords,
  nextPoint: Coords
): [string, number] {
  const prevProgress = calculateRouteProgress(route, prevPoint);
  const nextProgress = calculateRouteProgress(route, nextPoint);
  if (!prevProgress || !nextProgress) {
    return null;
  }
  if (prevProgress < nextProgress) {
    return [route.properties.end_geoid, nextProgress];
  } else {
    return [route.properties.begin_geoid, route.properties.distance - nextProgress];
  }
}

const position$: Observable<Coords> = actions$
  .pipe(
    filter((action) => action.type === '[Position] Set position'),
    map((action) => ([action.coords.longitude, action.coords.latitude])),
  );

const debouncedPosition$ = position$.pipe(
  scan((prev, curr) => {
    if (!prev) {
      return prev;
    }
    const distance = turf.distance(prev, curr, {units: 'meters'});
    return distance > 500 ? curr : prev;
  }),
  distinctUntilChanged(),
);

const neighborhood$ = debouncedPosition$.pipe(
  mergeMap(location => getNearbyNetworks(location)),
  mergeMap(networkIds => Promise.all([fetchNodes(networkIds), fetchRoutes(networkIds)])),
  withLatestFrom(position$),
  map(([[nodes, routes], position]) => {
    const nodesCloseBy = nodes.filter(node => turf.distance(node.location, position, {units: 'meters'}) < 5000);
    const connections = [].concat.apply([], nodesCloseBy.map(node => node.connections))
      .map(connection => connection.route);
    const routesConnectingNodesCloseBy = routes.filter(route => connections.includes(route.properties.pid));
    return {nodes: nodesCloseBy, routes: routesConnectingNodesCloseBy};
  })
);

const activeRoute$ = position$.pipe(
  withLatestFrom(neighborhood$),
  map(([position, {routes}]) => getActiveRoute(routes, position)),
  distinctUntilChanged((prev, curr) => {
    const prevPid = prev ? prev.properties.pid : null;
    const currPid = curr ? curr.properties.pid : null;
    return prevPid === currPid;
  }),
);

const destinationNode$ = position$.pipe(
  pairwise(),
  withLatestFrom(activeRoute$),
  map(([[prevPosition, currPosition], route]) => calculateDestinationAndProgress(route, prevPosition, currPosition)),
  withLatestFrom(neighborhood$),
  map(([result, {nodes}]): Destination => {
    if (!result) {
      return null;
    }
    return {
      node: nodes.find(node => node.id === result[0]),
      progress: result[1]
    };
  }),
  distinctUntilChanged((prev, curr) => {
    console.log("result", prev, curr);
    const prevPid = prev ? prev.node.id : null;
    const currPid = curr ? curr.node.id : null;
    return prevPid === currPid;
  }),
);

// Subscribers to post data back to app
neighborhood$.subscribe(({nodes, routes}) => {
  console.log('neighborhood$', nodes, routes);
  postMessage({nodes, routes});
});
activeRoute$.subscribe(route => {
  console.log('activeRoute$', route);
});
destinationNode$.subscribe(destination => {
  console.log('destinationNode$', destination);
});
// const response = `worker response to ${data}`;
// postMessage(response);
