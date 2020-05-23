import {PositionState} from './position.types';
import {Action, createReducer, on} from '@ngrx/store';
import * as Actions from './position.actions';

const initialState: PositionState = {
  speed: null,
  heading: null,
  location: null,
  error: false,
};

const reducer = createReducer(
  initialState,
  on(Actions.geolocationError, () => ({
    ...initialState,
    error: true,
  })),
  on(Actions.setPosition, (state, {coords}) => ({
    speed: coords.speed,
    heading: coords.heading,
    error: false,
    location: {
      latitude: coords.latitude,
      longitude: coords.longitude,
    }
  }))
);

export function positionReducer(state: PositionState = initialState, action: Action) {
  return reducer(state, action);
}
