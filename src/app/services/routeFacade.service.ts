import {Injectable} from '@angular/core';
import {AppState} from '../store';
import {Store} from '@ngrx/store';
import {map, withLatestFrom} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Destination} from '../store/route/route.types';
import {nodeIsNearbyDistance} from '../constants';
import {Node} from '../store/neighborhood/neighborhood.types';

const selectRouteState = (state: AppState) => state.route.route;
const selectDestination = (state: AppState) => state.route.destination;

@Injectable()
export class RouteFacadeService {

  public activeRoute$ = this.store.select(selectRouteState);
  public destinationNode$: Observable<Destination> = this.store.select(selectDestination);
  public nearbyNode$: Observable<{ node: Node, progress: number, total: number, currentRouteId: string }> = this.destinationNode$.pipe(
    withLatestFrom(this.activeRoute$),
    map(([destination, route]) => destination &&
      route &&
      route.properties.distance - destination.progress < nodeIsNearbyDistance ? {
        node: destination.node,
        progress: destination.progress,
        total: route.properties.distance,
      currentRouteId: route.properties.pid
      } : null
    )
  );

  constructor(private store: Store<AppState>) {
  }

}
