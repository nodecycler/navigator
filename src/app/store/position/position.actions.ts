import {createAction, props} from '@ngrx/store';

export interface Coords {
  readonly latitude: number;
  readonly longitude: number;
}
export const geolocationError = createAction('[Position] Error');
export const setPosition = createAction('[Position] Set position', props<{coords: Coords}>());
