import {Component, OnInit} from '@angular/core';
import {GeolocationService} from './services/geolocation.service';
import {WakeLockService} from './services/wake-lock.service';
import {filter, first} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = true;
  error = false;

  constructor(
    private geo: GeolocationService,
    private wakeLock: WakeLockService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.wakeLock.start();
    this.geo.start();
    this.store.select("position").subscribe(state => {
      if (state.location) {
        this.loading = false;
      }
      this.error = state.error;
    });
    this.geo.position$.pipe(
      filter(state => !!state.location),
      first(),
    ).subscribe(() => {
      this.loading = false;
    });
  }

}
