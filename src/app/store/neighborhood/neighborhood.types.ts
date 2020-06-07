import {Route} from '../route/route.types';

export interface NodeConnection {
  id: string;
  number: string;
  location: [number, number];
  distance: number;
  route: string;
}

export interface Node {
  id: string;
  number: string;
  distance ?: number;
  connections: NodeConnection[];
  location: [number, number];
}


export interface NeighborhoodState {
  nodes: Node[];
  routes: Route[];
}
