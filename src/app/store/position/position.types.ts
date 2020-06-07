import {Coords} from './position.actions';

export interface PositionState {
  error?: any;
  isSupported?: boolean;
  position: Coords;
  bearing: number;
}
