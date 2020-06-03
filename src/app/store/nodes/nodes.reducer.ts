import {Action, createReducer, on} from '@ngrx/store';
import * as Actions from './nodes.actions';
import {Node} from './nodes.types';

const initialState = {
  nodes: [],
  routes: []
};

const reducer = createReducer(
  initialState,
  on(Actions.getNearestNodes, (state, {nodes, routes}) => ({nodes, routes}))
);

export function nodesReducer(state = initialState, action: Action) {
  return reducer(state, action);
}
