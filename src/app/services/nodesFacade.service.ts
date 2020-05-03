import {Injectable} from '@angular/core';
import {AppState} from '../store';
import {createSelector, Store} from '@ngrx/store';
import {mergeMap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FeatureCollection} from 'geojson';

const selectNodes = (state: AppState) => state.nodes;

const selectRouteIds = createSelector(selectNodes,
  (nodes) => {
    const routes = [];
    nodes.forEach(node => {
      node.connections.forEach(connection => {
        if (routes.indexOf(connection.route) < 0) {
          routes.push(connection.route);
        }
      });
    });
    return routes;
  });

@Injectable()
export class NodesFacadeService {
  public nodes$ = this.store.select(selectNodes);
  public routeIds$ = this.store.select(selectRouteIds);
  public routes$ = this.routeIds$.pipe(
    mergeMap(routeIds => this.fetchRouteDataForRouteIds(routeIds))
  );

  constructor(private store: Store<AppState>, private http: HttpClient) {
  }

  private fetchRouteDataForRouteIds(routeIds: string[]) {
    return combineLatest(routeIds.map(id => this.http.get(`./data/routes/${id}.json`))) as Observable<FeatureCollection[]>;
  }
}
