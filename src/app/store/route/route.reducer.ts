import {Action, createReducer, on} from '@ngrx/store';
import * as Actions from './route.actions';
import {RouteState} from './route.types';
import {bearing, lineDistance, lineSlice, lineString} from '@turf/turf';
import {Feature, LineString, Point} from 'geojson';

const initialState: RouteState = {
  route: null,
  point: null,
  bearing: 0,
  destinationNodeId: null,
  routeProgress: null,
};
const calculateRouteProgress = (route: Feature<LineString>, point: Feature<Point>) => {
  if (!route || !point) {
    return null;
  }
  const slicedLine = lineSlice(route.geometry.coordinates[0], point.geometry.coordinates, lineString(route.geometry.coordinates));
  return lineDistance(slicedLine, {units: 'meters'});
};

const calculateDestinationAndProgress = (
  route: Feature<LineString>,
  prevPoint: Feature<Point>,
  nextPoint: Feature<Point>
) => {
  const prevProgress = calculateRouteProgress(route, prevPoint);
  const nextProgress = calculateRouteProgress(route, nextPoint);
  if (!prevProgress || !nextProgress) {
    return [null, null];
  }
  if (prevProgress < nextProgress) {
    return [route.properties.end_geoid, nextProgress];
  } else {
    return [route.properties.begin_geoid, route.properties.Shape_Length - nextProgress];
  }
};

const reducer = createReducer(
  initialState,
  on(Actions.setCurrentRoute, (state, {route, point}) => {
    let destinationNodeId = null;
    let routeProgress = null;

    if (state.route && route && state.route.properties.pid === route.properties.pid) {
      [destinationNodeId, routeProgress] = calculateDestinationAndProgress(route, state.point, point);
    }

    return {
      route,
      point,
      bearing: state.point && point ? bearing(state.point, point) : 0,
      destinationNodeId,
      routeProgress,
    };
  }),
  on(Actions.clearCurrentRoute, (state) => ({
    route: null,
    point: null,
    bearing: 0,
    destinationNodeId: null,
    routeProgress: null,
  }))
);

export function routeReducer(state: RouteState = initialState, action: Action) {
  return reducer(state, action);
}
