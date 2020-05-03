import {PositionState} from './position.types';
import {Action, createReducer, on} from '@ngrx/store';
import * as Actions from './position.actions';

const initialState: PositionState = {
  speed: null,
  heading: null,
  location: null,
};

const reducer = createReducer(
  initialState,
  on(Actions.geolocationError, state => ({
    ...initialState,
  })),
  on(Actions.setPosition, (state, {coords}) => ({
    speed: coords.speed,
    heading: coords.heading,
    location: {
      latitude: coords.latitude,
      longitude: coords.longitude,
    }
  }))
);

export function positionReducer(state: PositionState = initialState, action: Action) {
  return reducer(state, action);
}
