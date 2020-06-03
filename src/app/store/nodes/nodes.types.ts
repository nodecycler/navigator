
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

export interface Destination {
  node: Node;
  progress: number;
}
