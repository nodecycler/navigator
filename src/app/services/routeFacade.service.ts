import {Injectable} from '@angular/core';
import {AppState} from '../store';
import {createSelector, Store} from '@ngrx/store';
import {first, map, mergeMap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FeatureCollection} from 'geojson';
import {NodesFacadeService} from './nodesFacade.service';

const selectRouteState = (state: AppState) => state.route;
const selectClosestRoutes = createSelector(selectRouteState, (state => state.closestRoutes));

@Injectable()
export class RouteFacadeService {

  public activeRoute$ = this.store.select(selectRouteState);
  public destinationNode$ = this.activeRoute$.pipe(
    mergeMap(activeRouteState => this.nodesFacade.nodes$.pipe(
      first(),
      map(nodes => ({
        node: nodes.find(node => node.id === activeRouteState.destinationNodeId),
        progress: activeRouteState.routeProgress,
        total: activeRouteState.route ? activeRouteState.route.properties.distance : null
      })),
    ))
  );
  public closestRoutes$ = this.store.select(selectClosestRoutes);

  constructor(private store: Store<AppState>, private nodesFacade: NodesFacadeService) {
  }

}
