import {createAction, props} from '@ngrx/store';
import {Feature, LineString, Point} from 'geojson';
import {ClosestRoute} from './route.types';

export const setCurrentRoute = createAction('[Route] Set current route', props<{route: Feature<LineString>, point: Feature<Point>}>());
export const clearCurrentRoute = createAction('[Route] Clear');
export const setClosestRoutes = createAction('[Route] Set closest routes', props<{routes: ClosestRoute[]}>());
