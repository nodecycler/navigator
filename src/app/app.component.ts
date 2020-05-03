import {Component, OnInit} from '@angular/core';
import {GeolocationService} from './services/geolocation.service';
import {WakeLockService} from './services/wake-lock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Node cycler Navigator';

  constructor(
    private geo: GeolocationService,
    private wakeLock: WakeLockService,
  ) {
  }

  ngOnInit() {
    this.wakeLock.start();
    this.geo.start();
  }

}
