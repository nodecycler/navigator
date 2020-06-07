import {PositionState} from './position.types';
import {Action, createReducer, on} from '@ngrx/store';
import * as Actions from './position.actions';
import {bearing} from '@turf/turf';

const initialState: PositionState = {
  bearing: null,
  position: null,
  error: false,
};

const reducer = createReducer(
  initialState,
  on(Actions.geolocationError, () => ({
    ...initialState,
    error: true,
  })),
  on(Actions.setPosition, (state, {position}) => ({
    error: false,
    position,
    bearing: state.position ? bearing(state.position, position) : null,
  }))
);

export function positionReducer(state: PositionState = initialState, action: Action) {
  return reducer(state, action);
}
