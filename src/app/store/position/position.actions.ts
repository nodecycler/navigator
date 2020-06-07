import {createAction, props} from '@ngrx/store';

export type Coords = [number, number];

export const geolocationError = createAction('[Position] Error');
export const setPosition = createAction('[Position] Set position', props<{position: Coords}>());
