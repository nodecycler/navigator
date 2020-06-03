import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {nearestPointOnLine} from '@turf/turf';
import {Coords, setPosition} from '../store/position/position.actions';
import {combineLatest} from 'rxjs';
import {Feature, FeatureCollection, LineString} from 'geojson';
import {setClosestRoutes} from '../store/route/route.actions';
import {NodesFacadeService} from '../services/nodesFacade.service';
import {ClosestRoute, Route} from '../store/route/route.types';

@Injectable()
export class CurrentRouteEffects {
/*
  getCurrentRoute$ = createEffect(() => combineLatest([
      this.nodesFacade.routes$,
      this.actions$.pipe(ofType(setPosition)),
    ])
      .pipe(
        map(([routes, {coords}]) => {
          return setClosestRoutes({routes: this.getClosestRoutes(routes, coords)});
        })
      )
  );
*/

  constructor(private actions$: Actions, private nodesFacade: NodesFacadeService) {
  }

  private getClosestRoutes(routes: Route[], coords: Coords): ClosestRoute[] {
    return routes
      .map(feature => {
        return {
          route: feature,
          point: nearestPointOnLine(feature.geometry, [coords.longitude, coords.latitude], {units: 'meters'}),
        };
      })
      .sort((a, b) => a.point.properties.dist - b.point.properties.dist)
      .splice(0, 1);
  }

}
