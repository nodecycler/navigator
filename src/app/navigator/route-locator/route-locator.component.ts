import {Component, OnInit} from '@angular/core';
import {RouteFacadeService} from '../../services/routeFacade.service';
import {NeighborhoodService} from '../../services/neighborhood.service';
import {combineLatest} from 'rxjs';
import {map, withLatestFrom} from 'rxjs/operators';
import {bearing} from '@turf/turf';
import {GeolocationService} from '../../services/geolocation.service';

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
  route: RouteViewInterface;

  constructor(
    private neighborhood: NeighborhoodService,
    private routeFacade: RouteFacadeService,
    private geo: GeolocationService,
  ) {
  }

  ngOnInit() {
    combineLatest([this.routeFacade.activeRoute$, this.neighborhood.closestRoute$]).pipe(
      map(([active, closest]) => {
        return active ? null : closest;
      })
    )
      .pipe(
          withLatestFrom(this.neighborhood.nodes$, this.geo.improvedPosition$),
      )
      .subscribe(([route, nodes, position]) => {
        if (!route) {
          this.route = null;
          return;
        }
        const begin = nodes.find(node => node.id === route.route.properties.begin_geoid).number;
        const end = nodes.find(node => node.id === route.route.properties.end_geoid).number;
        this.route = {
          begin,
          end,
          distance: this.getDistance(route.point),
          bearingStyle: `rotate(${this.getBearing(route.point, position.position)}deg)`,
        };
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
    return bearing(position, point);
  }
}
