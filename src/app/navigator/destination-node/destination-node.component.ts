import {Component, OnInit} from '@angular/core';
import {combineLatest} from 'rxjs';
import {RouteFacadeService} from '../../services/routeFacade.service';

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
    combineLatest([this.route.destinationNode$])
      .subscribe(([{node, progress, total}]) => {
        this.node = node;
        this.total = total;
        this.progress = progress;
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
