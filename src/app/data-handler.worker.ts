/// <reference lib="webworker" />
import {distinctUntilChanged, map, pairwise, scan, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import * as turf from '@turf/turf';
import {lineDistance, lineSlice, lineString, nearestPointOnLine} from '@turf/turf';
import {combineLatest, Observable, Subject} from 'rxjs';
import {Feature, FeatureCollection, LineString, Polygon} from 'geojson';
import {Node} from './store/neighborhood/neighborhood.types';
import {Destination, Route} from './store/route/route.types';
import {networkIsCloseEnough} from './constants';
import {fromPromise} from 'rxjs/internal-compatibility';

// Fetch can't handle file:// url's - which are in use in Cordova
function fetch<T>(url): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(JSON.parse(xhr.responseText) as T);
    };
    xhr.onerror = () => {
      reject(new TypeError('Local request failed'));
    };
    xhr.open('GET', url);
    xhr.send(null);
  });
}

type Coords = [number, number];

// Create actions stream
const coords$ = new Subject<Coords>();
addEventListener('message', ({data}) => {
  coords$.next(data);
});

// Fetch network
const fetchNetworks: Promise<FeatureCollection> = fetch('./data/networks.json');

function fetchNodes(networkIds: number[]): Promise<Node[]> {
  return Promise.all(
    networkIds.map(network => fetch(`./data/nodes_${network}.json`))
  )
    .then(fetchResults => [].concat.apply([], fetchResults));
}

function fetchRoutes(networkIds: number[]): Promise<Route[]> {
  return Promise.all(networkIds.map(network => fetch(`./data/routes_${network}.json`)))
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
        return distance < networkIsCloseEnough;
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

function calculateRouteProgress(route: Feature<LineString>, point: Coords) {
  if (!route || !point) {
    return null;
  }
  const slicedLine = lineSlice(route.geometry.coordinates[0], point, lineString(route.geometry.coordinates));
  return lineDistance(slicedLine, {units: 'meters'});
}

function calculateDestinationAndProgress(route: Route, prevPoint: Coords, nextPoint: Coords): [string, number] {
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

const position$: Observable<Coords> = coords$.asObservable();

const debouncedPosition$ = position$.pipe(
  scan((prev, curr) => {
    if (!prev) {
      return curr;
    }
    const distance = turf.distance(prev, curr, {units: 'meters'});
    return distance > 500 ? curr : prev;
  }),
  distinctUntilChanged(),
);

const neighborhood$ = debouncedPosition$.pipe(
  switchMap(location => fromPromise(getNearbyNetworks(location)
    .then(networkIds => Promise.all([fetchNodes(networkIds), fetchRoutes(networkIds)]))
    .then(([nodes, routes]) => {
      const nodesCloseBy = nodes.filter(node => turf.distance(node.location, location, {units: 'meters'}) < 5000);
      const connections = [].concat.apply([], nodesCloseBy.map(node => node.connections))
        .map(connection => connection.route);
      const routesConnectingNodesCloseBy = routes.filter(route => connections.includes(route.properties.pid));
      return {nodes: nodesCloseBy, routes: routesConnectingNodesCloseBy};
    })),
  ),
);

const activeRoute$: Observable<Route> = combineLatest([position$, neighborhood$]).pipe(
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
    if (!prev || !curr) {
      return prev === curr;
    }
    const prevPid = prev ? prev.node.id : null;
    const currPid = curr ? curr.node.id : null;
    return prevPid === currPid && prev.progress === curr.progress;
  }),
);

const improvedPosition$ = combineLatest([position$, activeRoute$]).pipe(
  map(([position, activeRoute]) => {
    if (!activeRoute) {
      return position;
    }
    return nearestPointOnLine(activeRoute, position).geometry.coordinates;
  }),
);

// Subscribers to post data back to app
neighborhood$.subscribe(({nodes, routes}) => {
  postMessage({nodes, routes});
});
activeRoute$.subscribe(activeRoute => {
  postMessage({activeRoute});
});
destinationNode$.subscribe(destinationNode => {
  postMessage({destinationNode});
});
improvedPosition$.subscribe((position) => {
  postMessage({position});
});

