import {createAction, props} from '@ngrx/store';
import {Feature, LineString, Point} from 'geojson';

export const setCurrentRoute = createAction('[Route] Set current route', props<{route: Feature<LineString>, point: Feature<Point>}>());
export const clearCurrentRoute = createAction('[Route] Clear');
