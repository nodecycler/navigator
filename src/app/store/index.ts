import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {PositionState} from './position/position.types';
import {positionReducer} from './position/position.reducer';
import {nodesReducer} from './nodes/nodes.reducer';
import {Node} from './nodes/nodes.types';
import {RouteState} from './route/route.types';
import {routeReducer} from './route/route.reducer';
import {Feature} from 'geojson';

export interface AppState {
  position: PositionState;
  nodes: {
    nodes: Node[];
    routes: Feature[];
  };
  route: RouteState;
}

export const reducers: ActionReducerMap<AppState> = {
  position: positionReducer,
  nodes: nodesReducer,
  route: routeReducer,
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
