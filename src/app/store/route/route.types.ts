import {Feature, FeatureCollection, LineString, Point} from 'geojson';
import {NearestPointOnLine} from '@turf/nearest-point-on-line';

export interface RouteState {
  route: Feature<LineString>;
  point: Feature<Point>;
  bearing: number;
  routeProgress: number;
  destinationNodeId: string;
  closestRoutes: ClosestRoute[];
}

export interface ClosestRoute {
  route: Feature<LineString>;
  point: NearestPointOnLine;
}
