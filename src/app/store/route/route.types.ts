import {Feature, LineString} from 'geojson';
import {Node} from '../neighborhood/neighborhood.types';

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
  destination: Destination;
}

export interface Destination {
  node: Node;
  progress: number;
}
