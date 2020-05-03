import {Component, OnInit} from '@angular/core';
import {combineLatest} from 'rxjs';
import {filter, map, tap, throttleTime} from 'rxjs/operators';
import {GeolocationService} from '../../services/geolocation.service';
import {RouteFacadeService} from '../../services/routeFacade.service';
import {NodesFacadeService} from '../../services/nodesFacade.service';
import {PositionState} from '../../store/position/position.types';
import {Node} from '../../store/nodes/nodes.types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  state: PositionState;
  nodes: Node[] = [];
  routes: string[] = [];
  activeRoute = null;
  center = null;
  bearing = 0;
  marker = null;

  constructor(
    private routeFacade: RouteFacadeService,
    private nodesFacade: NodesFacadeService,
    private geolocation: GeolocationService
  ) {
  }

  ngOnInit() {
    this.geolocation.position$.subscribe((state: PositionState) => {
      this.state = state;
    });
    this.nodesFacade.nodes$.subscribe(nodes => {
      this.nodes = nodes;
    });
    this.nodesFacade.routeIds$.subscribe(routes => {
      this.routes = routes;
    });
    combineLatest([this.routeFacade.activeRoute$, this.geolocation.position$.pipe(
      filter(geo => !!geo.location)
    )])
      .pipe(
        map(([routeState, geoState]) => ({
          activeRoute: routeState.route,
          point: routeState.point ? routeState.point.geometry.coordinates : [geoState.location.longitude, geoState.location.latitude],
          bearing: routeState.bearing || 360,
        })),
        tap(({point}) => {
          this.marker = point;
        }),
        throttleTime(1000)
      ).subscribe(data => {
      this.activeRoute = data.activeRoute;
      this.center = data.point;
      this.bearing = data.bearing;
    });

  }

  get zoom() {
    return this.activeRoute ? 17 : 15;
  }

  get pitch() {
    return this.activeRoute ? 60 : 1;
  }
}
