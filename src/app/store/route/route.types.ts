import {Feature, LineString, Point} from 'geojson';

export interface RouteState {
  route: Feature<LineString>;
  point: Feature<Point>;
  bearing: number;
  routeProgress: number;
  destinationNodeId: string;
}
