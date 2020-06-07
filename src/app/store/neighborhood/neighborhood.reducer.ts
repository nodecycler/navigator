import {Action, createReducer, on} from '@ngrx/store';
import * as Actions from './neighborhood.actions';

const initialState = {
  nodes: [],
  routes: []
};

const reducer = createReducer(
  initialState,
  on(Actions.setNeighborhood, (state, {nodes, routes}) => ({nodes, routes}))
);

export function neighborhoodReducer(state = initialState, action: Action) {
  return reducer(state, action);
}
