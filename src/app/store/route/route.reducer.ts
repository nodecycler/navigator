import {Action, createReducer, on} from '@ngrx/store';
import * as Actions from './route.actions';
import {RouteState} from './route.types';

const initialState: RouteState = {
  route: null,
  destination: null,
};


const reducer = createReducer(
  initialState,
  on(Actions.setActiveRoute, (state, {route}) => ({
    ...state,
    route,
  })),
  on(Actions.setDestination, (state, {destination}) => ({
    ...state,
    destination,
  })),
);

export function routeReducer(state: RouteState = initialState, action: Action) {
  return reducer(state, action);
}
