import {createAction, props} from '@ngrx/store';

export const geolocationError = createAction('[Position] Error');
export const setPosition = createAction('[Position] Set position', props<{coords: Coordinates}>());
