export interface PositionState {
  error?: any;
  isSupported?: boolean;
  location: {
    longitude: number;
    latitude: number;
  };
  speed: number;
  heading: number;
}
