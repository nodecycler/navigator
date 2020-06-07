import {createAction, props} from '@ngrx/store';
import {Destination, Route} from './route.types';

export const setActiveRoute = createAction('[Route] Set active route', props<{route: Route}>());
export const setDestination = createAction('[Route] Set destination', props<{destination: Destination}>());
