import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {PositionState} from './position/position.types';
import {positionReducer} from './position/position.reducer';
import {neighborhoodReducer} from './neighborhood/neighborhood.reducer';
import {RouteState} from './route/route.types';
import {routeReducer} from './route/route.reducer';
import {NeighborhoodState} from './neighborhood/neighborhood.types';

export interface AppState {
  position: PositionState;
  neighborhood: NeighborhoodState;
  route: RouteState;
}

export const reducers: ActionReducerMap<AppState> = {
  position: positionReducer,
  neighborhood: neighborhoodReducer,
  route: routeReducer,
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
