import {createAction, props} from '@ngrx/store';
import {Feature} from 'geojson';
import {Node} from './neighborhood.types';

export const setNeighborhood = createAction('[Neighborhood] Set nodes & routes', props<{nodes: Node[], routes: Feature[]}>());
