import {Injectable} from '@angular/core';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import {map, withLatestFrom} from 'rxjs/operators';
import {nearestPointOnLine} from '@turf/turf';
import {Route} from '../store/route/route.types';
import {NearestPointOnLine} from '@turf/nearest-point-on-line';
import {GeolocationService} from './geolocation.service';
import {Observable} from 'rxjs';
import {Coords} from '../store/position/position.actions';

const selectNodes = (state: AppState) => state.neighborhood.nodes;
const selectRoutes = (state: AppState) => state.neighborhood.routes;

export interface ClosestRoute {
  route: Route;
  point: NearestPointOnLine;
}

function getClosestRoute(routes: Route[], coords: Coords): ClosestRoute {
  return routes
    .map(feature => {
      return {
        route: feature,
        point: nearestPointOnLine(feature.geometry, coords, {units: 'meters'}),
      };
    })
    .sort((a, b) => a.point.properties.dist - b.point.properties.dist)
    .shift();
}

@Injectable()
export class NeighborhoodService {
  public nodes$ = this.store.select(selectNodes);
  public routes$: Observable<Route[]> = this.store.select(selectRoutes);
  public closestRoute$ = this.geo.improvedPosition$.pipe(
    withLatestFrom(this.routes$),
    map(([coords, routes]) => getClosestRoute(routes, coords.position))
  );

  constructor(private store: Store<AppState>, private geo: GeolocationService) {
  }

}
