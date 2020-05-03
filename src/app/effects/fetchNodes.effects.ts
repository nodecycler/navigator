import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, mergeMap, throttleTime} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {distance} from '@turf/turf';
import {Node} from '../store/nodes/nodes.types';
import {getNearestNodes} from '../store/nodes/nodes.actions';
import {setPosition} from '../store/position/position.actions';

@Injectable()
export class FetchNodesEffects {
  getNearestNodes$ = createEffect(() => this.actions$.pipe(
    ofType(setPosition),
    throttleTime(60000),
    mergeMap(({coords}) => this.http.get('./data/nodes.json').pipe(
      map((nodes: Node[]) => this.filterNearestNodes(nodes, coords))
    )),
    map(nodes => getNearestNodes({nodes}))
  ));

  constructor(private actions$: Actions, private http: HttpClient) {
  }

  private filterNearestNodes(nodes: Node[], coords: Coordinates) {
    nodes.forEach(node => {
      node.distance = distance([coords.longitude, coords.latitude], node.location);
    });
    return nodes
      .sort((a, b) => a.distance - b.distance)
      .splice(0, 20);

  }
}
