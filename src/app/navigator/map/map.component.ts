import {Component, OnInit} from '@angular/core';
import {combineLatest} from 'rxjs';
import {filter, map, tap, throttleTime} from 'rxjs/operators';
import {GeolocationService} from '../../services/geolocation.service';
import {RouteFacadeService} from '../../services/routeFacade.service';
import {NodesFacadeService} from '../../services/nodesFacade.service';
import {PositionState} from '../../store/position/position.types';
import {Node, NodeConnection} from '../../store/nodes/nodes.types';
import {connectingColors, nodeIsNearbyDistance} from '../../constants';
import {bearing as turfBearing} from '@turf/turf';
import {Feature} from 'geojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  state: PositionState;
  nodes: Node[] = [];
  routes: Feature[] = [];
  activeRoute = null;
  center = null;
  bearing = 0;
  marker = null;
  zoom = 15;
  pitch = 0;
  connectingRoutes: NodeConnection[] = [];

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
    this.nodesFacade.routes$.subscribe(routes => {
      this.routes = routes;
    });
    combineLatest([
      this.routeFacade.activeRoute$,
      this.geolocation.position$.pipe(
        filter(geo => !!geo.location)
      ),
      this.routeFacade.destinationNode$,
    ])
      .pipe(
        map(([routeState, geoState, destinationNode]) => ({
          activeRoute: routeState.route,
          center: routeState.point ? routeState.point.geometry.coordinates : [geoState.location.longitude, geoState.location.latitude],
          bearing: routeState.bearing || 360,
          destinationNode,
        })),
        tap(({center, activeRoute, destinationNode}) => {
          this.marker = center;
          this.activeRoute = activeRoute;
          this.connectingRoutes = [];
          if (destinationNode && destinationNode.node) {
            const remaining = destinationNode.total - destinationNode.progress;
            if (remaining < 200) {
              // NEAR THE NODE
              this.connectingRoutes = destinationNode.node.connections;
              return;
            }
          }
        }),
        throttleTime(1000)
      ).subscribe(({destinationNode, center, bearing, activeRoute}) => {
      if (destinationNode && destinationNode.node) {
        const remaining = destinationNode.total - destinationNode.progress;
        if (remaining < nodeIsNearbyDistance) {
          // NEAR THE NODE
          this.center = destinationNode.node.location;
          this.bearing = turfBearing(center, destinationNode.node.location);
          this.zoom = 18;
          this.pitch = 1;
          return;
        }
      }
      this.zoom = activeRoute ? 17 : 15;
      this.pitch = activeRoute ? 60 : 1;
      this.center = center;
      this.bearing = bearing;
    });

  }

  getRouteColor(route) {
    if (this.activeRoute && this.activeRoute.properties.pid === route) {
      return '#579120';
    }
    const index = this.connectingRoutes.findIndex(connection => route === connection.route);
    if (index >= 0) {
      return connectingColors[index];
    }
    return '#85DD31';
  }
}
