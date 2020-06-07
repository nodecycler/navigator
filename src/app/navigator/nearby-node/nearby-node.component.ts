import {Component, OnInit} from '@angular/core';
import {RouteFacadeService} from '../../services/routeFacade.service';
import {connectingColors} from '../../constants';
import {Node} from '../../store/neighborhood/neighborhood.types';

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
    this.routeFacade.nearbyNode$.subscribe((nearby) => {
      if (!nearby) {
        this.currentRouteId = null;
        this.node = null;
        return;
      }
      const {node, currentRouteId} = nearby;
      this.currentRouteId = currentRouteId;
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
