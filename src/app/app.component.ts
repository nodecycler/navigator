import {Component, OnInit} from '@angular/core';
import {GeolocationService} from './services/geolocation.service';
import {WakeLockService} from './services/wake-lock.service';
import {Store} from '@ngrx/store';
import {AppState} from './store';
import {setPosition} from './store/position/position.actions';
import {setNeighborhood} from './store/neighborhood/neighborhood.actions';
import {setActiveRoute, setDestination} from './store/route/route.actions';

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
    this.setupWorker();
    this.store.select('position').subscribe(state => {
      if (state.position) {
        this.loading = false;
      }
      this.error = state.error;
    });
  }

  setupWorker() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('src/app/data-handler.worker', {type: 'module'});
      worker.onerror = (err) => {
        console.error(err);
      };
      worker.onmessage = ({data}) => {
        if (data.hasOwnProperty('nodes')) {
          this.store.dispatch(setNeighborhood({nodes: data.nodes, routes: data.routes}));
        }
        if (data.hasOwnProperty('position')) {
          this.store.dispatch(setPosition({position: data.position}));
        }
        if (data.hasOwnProperty('activeRoute')) {
          this.store.dispatch(setActiveRoute({route: data.activeRoute}));
        }
        if (data.hasOwnProperty('destinationNode')) {
          this.store.dispatch(setDestination({destination: data.destinationNode}));
        }
      };
      this.geo.position$.subscribe((location) => {
        worker.postMessage(location);
      });

    } else {
      console.error('Web workers not supported');
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
}
