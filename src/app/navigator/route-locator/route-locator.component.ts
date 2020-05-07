import { Component, OnInit } from '@angular/core';
import {RouteFacadeService} from '../../services/routeFacade.service';

@Component({
  selector: 'app-route-locator',
  templateUrl: './route-locator.component.html',
  styleUrls: ['./route-locator.component.scss']
})
export class RouteLocatorComponent implements OnInit {
  routes;
  constructor(private routeFacade: RouteFacadeService) { }

  ngOnInit() {
    this.routeFacade.closestRoutes$.subscribe(routes => {
      this.routes = routes;
    });
  }

}
