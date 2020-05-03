import {createAction, props} from '@ngrx/store';
import {Node} from './nodes.types';

export const getNearestNodes = createAction('[Nodes] Get nearest nodes', props<{nodes: Node[]}>());
