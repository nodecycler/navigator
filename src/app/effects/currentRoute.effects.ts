import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, mergeMap, throttleTime} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {distance, nearestPointOnLine} from '@turf/turf';
import {Node} from '../store/nodes/nodes.types';
import {getNearestNodes} from '../store/nodes/nodes.actions';
import {setPosition} from '../store/position/position.actions';
import {combineLatest} from 'rxjs';
import {Feature, FeatureCollection, LineString, Point} from 'geojson';
import {clearCurrentRoute, setCurrentRoute} from '../store/route/route.actions';
import {RouteFacadeService} from '../services/routeFacade.service';
import {NodesFacadeService} from '../services/nodesFacade.service';

@Injectable()
export class CurrentRouteEffects {
  getCurrentRoute$ = createEffect(() => combineLatest([
      this.nodesFacade.routes$,
      this.actions$.pipe(ofType(setPosition)),
    ])
      .pipe(
        map(([routes, {coords}]) => {
          const {route, point} = this.getClosestRoute(routes, coords);
          return point && point.properties.dist < 20 ?
            setCurrentRoute({route, point}) :
            clearCurrentRoute();
        })
      )
  );

  constructor(private actions$: Actions, private nodesFacade: NodesFacadeService) {
  }

  private getClosestRoute(routes: FeatureCollection[], coords: Coordinates) {
    let closestRoute = null;
    let closestPoint: Feature<Point> = null;
    routes
      .map(route => route.features[0] as Feature<LineString>)
      .forEach(feature => {
        const point = nearestPointOnLine(feature.geometry, [coords.longitude, coords.latitude], {units: 'meters'});
        if (closestPoint === null || closestPoint.properties.dist > point.properties.dist) {
          closestPoint = point;
          closestRoute = feature;
        }
      });
    return {route: closestRoute, point: closestPoint};
  }

}
