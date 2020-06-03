import {Component, OnInit} from '@angular/core';
import {GeolocationService} from './services/geolocation.service';
import {WakeLockService} from './services/wake-lock.service';
import {filter, first} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from './store';
import {Actions} from '@ngrx/effects';
import {getNearestNodes} from './store/nodes/nodes.actions';

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
    private actions$: Actions,
  ) {
  }

  ngOnInit() {
    this.wakeLock.start();
    this.geo.start();
    this.setupWorker();
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

  setupWorker() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('src/app/data-handler.worker', {type: 'module'});
      worker.onerror = (err) => {
        console.error(err);
      };
      worker.onmessage = ({data}) => {
        if (data.nodes) {
          this.store.dispatch(getNearestNodes({nodes: data.nodes, routes: data.routes}));
        }
      };
      this.actions$.subscribe(action => worker.postMessage(action));
    } else {
      console.error('Web workers not supported');
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
}
