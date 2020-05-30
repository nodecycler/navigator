import {Feature, FeatureCollection, LineString, Point} from 'geojson';
import {NearestPointOnLine} from '@turf/nearest-point-on-line';

export interface Route extends Feature<LineString> {
  properties: {
    begin_geoid: string;
    end_geoid: string;
    distance: number;
    pid: string;
  };
}
export interface RouteState {
  route: Route;
  point: Feature<Point>;
  bearing: number;
  routeProgress: number;
  destinationNodeId: string;
  closestRoutes: ClosestRoute[];
}

export interface ClosestRoute {
  route: Route;
  point: NearestPointOnLine;
}
