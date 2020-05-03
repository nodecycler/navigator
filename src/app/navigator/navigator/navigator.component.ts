import { Component, OnInit } from '@angular/core';
import {GeolocationService} from '../../services/geolocation.service';
import {RouteFacadeService} from '../../services/routeFacade.service';
import {filter, first} from 'rxjs/operators';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit {
  ngOnInit() {

  }

}
