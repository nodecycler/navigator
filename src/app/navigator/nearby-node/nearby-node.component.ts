import {Component, OnInit} from '@angular/core';
import {RouteFacadeService} from '../../services/routeFacade.service';
import {map} from 'rxjs/operators';
import {Node} from '../../store/nodes/nodes.types';
import {connectingColors, nodeIsNearbyDistance} from '../../constants';
import {RouteState} from '../../store/route/route.types';

@Component({
  selector: 'app-nearby-node',
  templateUrl: './nearby-node.component.html',
  styleUrls: ['./nearby-node.component.scss']
})
export class NearbyNodeComponent implements OnInit {
  node: Node;
  currentRouteId = null;

  constructor(
    private routeFacade: RouteFacadeService,
  ) {
  }

  ngOnInit() {
    this.routeFacade.activeRoute$.subscribe((routeState: RouteState) => {
      this.currentRouteId = routeState && routeState.route ? routeState.route.properties.pid : null;
    });
    this.routeFacade.destinationNode$
      .pipe(
        map(destination => {
          if (!destination || !destination.node) {
            return null;
          }
          const remaining = destination.total - destination.progress;
          return remaining < nodeIsNearbyDistance ? destination.node : null;
        })
      )
      .subscribe(node => {
        this.node = node;
      });
  }

  formatDistance(distance) {
    if (distance > 1000) {
      return `${Math.round(distance / 100) / 10} km`;
    }
    return `${Math.round(distance)} m`;
  }

  getColor(connection) {
    return connectingColors[this.node.connections.indexOf(connection)];
  }
}
