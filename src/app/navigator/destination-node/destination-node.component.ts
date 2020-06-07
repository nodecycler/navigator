 import {Component, OnInit} from '@angular/core';
import {combineLatest} from 'rxjs';
import {RouteFacadeService} from '../../services/routeFacade.service';
 import {withLatestFrom} from 'rxjs/operators';

@Component({
  selector: 'app-destination-node',
  templateUrl: './destination-node.component.html',
  styleUrls: ['./destination-node.component.scss']
})
export class DestinationNodeComponent implements OnInit {

  node = null;
  progress = null;
  total = null;

  constructor(private route: RouteFacadeService) {
  }

  ngOnInit() {
    this.route.destinationNode$
      .pipe(
        withLatestFrom(this.route.activeRoute$)
      )
      .subscribe(([destination, route]) => {
        if (destination && route) {
          const {node, progress} = destination;
          this.node = node;
          this.total = route.properties.distance;
          this.progress = progress;
          return;
        }
        this.node = null;
        this.total = null;
        this.progress = null;
      });
  }

  get percentage() {
    if (!this.progress || !this.total) {
      return null;
    }
    return `${this.progress / this.total * 100}%`;
  }
  get remaining() {
    if (!this.progress || !this.node || !this.total) {
      return null;
    }
    const remaining = this.total - this.progress;
    if (remaining > 1000) {
      return `${Math.round(remaining / 100) / 10} km`;
    }
    return `${Math.round(remaining)} m`;
  }
}
