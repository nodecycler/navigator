import {Component, OnInit} from '@angular/core';
import {GeolocationService} from './services/geolocation.service';
import {WakeLockService} from './services/wake-lock.service';
import {filter, first} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = true;

  constructor(
    private geo: GeolocationService,
    private wakeLock: WakeLockService,
  ) {
  }

  ngOnInit() {
    this.wakeLock.start();
    this.geo.start();
    this.geo.position$.pipe(
      filter(state => !!state.location),
      first(),
    ).subscribe(() => {
      this.loading = false;
    });
  }

}
