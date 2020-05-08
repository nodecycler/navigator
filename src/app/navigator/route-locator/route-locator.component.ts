import {Component, OnInit} from '@angular/core';
import {RouteFacadeService} from '../../services/routeFacade.service';
import {NodesFacadeService} from '../../services/nodesFacade.service';
import {combineLatest, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Node} from '../../store/nodes/nodes.types';
import {GeolocationService} from '../../services/geolocation.service';
import {bearing} from '@turf/turf';

interface RouteViewInterface {
  begin: string;
  end: string;
  distance: string;
  bearingStyle: string;
}

@Component({
  selector: 'app-route-locator',
  templateUrl: './route-locator.component.html',
  styleUrls: ['./route-locator.component.scss']
})
export class RouteLocatorComponent implements OnInit {
  routes: RouteViewInterface[];

  constructor(
    private routeFacade: RouteFacadeService,
    private nodesFacade: NodesFacadeService,
    private geolocation: GeolocationService
  ) {
  }

  ngOnInit() {
    combineLatest([this.geolocation.position$, this.routeFacade.closestRoutes$, this.nodesFacade.nodes$])
      .pipe(
        map(([position, routes, nodes]) => {
          return routes.map(({route, point}) => {
            const begin = nodes.find(node => node.id === route.properties.begin_geoid).number;
            const end = nodes.find(node => node.id === route.properties.end_geoid).number;
            return {
              begin,
              end,
              distance: this.getDistance(point),
              bearingStyle: `rotate(${this.getBearing(point, position.location)}deg)`,
            };
          });
        })
      ).subscribe(routes => {
      this.routes = routes;
    });
  }

  getDistance(point) {
    const distance = point.properties.dist;
    if (distance > 1000) {
      return `${Math.round(distance / 100) / 10} km`;
    }
    return `${Math.round(distance)} m`;
  }

  getBearing(point, position) {
    return bearing([position.longitude, position.latitude], point);
  }
}
