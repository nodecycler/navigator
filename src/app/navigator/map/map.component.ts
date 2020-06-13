import {Component, OnInit} from '@angular/core';
import {combineLatest} from 'rxjs';
import {tap, throttleTime} from 'rxjs/operators';
import {GeolocationService} from '../../services/geolocation.service';
import {RouteFacadeService} from '../../services/routeFacade.service';
import {NeighborhoodService} from '../../services/neighborhood.service';
import {Node, NodeConnection} from '../../store/neighborhood/neighborhood.types';
import {connectingColors, nodeIsNearbyDistance} from '../../constants';
import {Feature} from 'geojson';
import {Route} from '../../store/route/route.types';
import {Coords} from '../../store/position/position.actions';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  nodes: Node[] = [];
  routes: Feature[] = [];
  activeRoute: Route = null;
  center: Coords = null;
  bearing = 0;
  markerBearing = 0;
  marker: Coords = null;
  zoom = 15;
  pitch = 0;
  layerCounter = 0;
  layers: {route: Route, id: number}[] = [];
  connectingRoutes: NodeConnection[] = [];

  constructor(
    private routeFacade: RouteFacadeService,
    private neighborhood: NeighborhoodService,
    private geolocation: GeolocationService
  ) {
  }

  ngOnInit() {
    this.neighborhood.nodes$.subscribe(nodes => {
      this.nodes = nodes;
    });
    this.neighborhood.routes$.subscribe(routes => {
      this.routes = routes;
      routes.forEach(route => {
        if (!this.layers.find(layer => layer.route.properties.pid === route.properties.pid)) {
          this.layers.push({id: this.layerCounter++, route});
        }
      });
      this.layers = this.layers.filter(layer => routes.find(route => route.properties.pid === layer.route.properties.pid));
    });

    combineLatest([
      this.routeFacade.activeRoute$,
      this.geolocation.improvedPosition$,
      this.routeFacade.destinationNode$,
    ])
      .pipe(
        tap(([route, position, destinationNode]) => {
          this.marker = position.position;
          this.activeRoute = route;
          this.connectingRoutes = [];
          if (destinationNode && destinationNode.node && route) {
            const remaining = route.properties.distance - destinationNode.progress;
            if (remaining < nodeIsNearbyDistance) {
              // NEAR THE NODE
              this.connectingRoutes = destinationNode.node.connections;
            }
          }
        }),
        throttleTime(1000)
      )
      .subscribe(([route, position, destinationNode]) => {
        this.markerBearing = position.bearing;
        if (route) {
          if (destinationNode && destinationNode.node) {
            const remaining = route.properties.distance - destinationNode.progress;
            if (remaining < nodeIsNearbyDistance) {
              // NEAR THE NODE
              this.bearing = position.bearing;
              this.center = destinationNode.node.location;
              this.zoom = 18;
              this.pitch = 1;
              return;
            }
          }
          this.bearing = position.bearing;
          this.zoom = 17;
          this.pitch = 60;
          this.center = position.position;
          return;
        }
        this.bearing = 360;
        this.zoom = 15;
        this.pitch = 1;
        this.center = position.position;
      });

  }

  get markerBearingStyle() {
    return `rotate(${this.markerBearing}deg)`;
  }

  getRouteColor(route: Route) {
    if (this.activeRoute && this.activeRoute.properties.pid === route.properties.pid) {
      return '#579120';
    }
    const index = this.connectingRoutes.findIndex(connection => route.properties.pid === connection.route);
    if (index >= 0) {
      return connectingColors[index];
    }
    return '#85DD31';
  }

}
