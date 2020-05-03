import {Action, createReducer, on} from '@ngrx/store';
import * as Actions from './nodes.actions';
import {Node} from './nodes.types';

const initialState: Node[] = [];

const reducer = createReducer(
  initialState,
  on(Actions.getNearestNodes, (state, {nodes}) => nodes)
);

export function nodesReducer(state: Node[] = initialState, action: Action) {
  return reducer(state, action);
}
