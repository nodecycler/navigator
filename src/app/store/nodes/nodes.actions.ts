import {createAction, props} from '@ngrx/store';
import {Node} from './nodes.types';
import {Feature} from 'geojson';

export const getNearestNodes = createAction('[Nodes] Get nearest nodes', props<{nodes: Node[], routes: Feature[]}>());
