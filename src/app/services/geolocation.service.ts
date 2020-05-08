import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {setPosition} from '../store/position/position.actions';

import {ACTIVITY} from '../../mock/activity';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private id = null;

  public position$ = this.store.select('position');

  constructor(private store: Store<AppState>) {
  }

  start() {
    if (this.id) {
      this.stop();
    }

    const positions = ACTIVITY;
    this.dispatch(positions[0]);

    let i = 1;
    this.id = setInterval(() => {
      if (i === positions.length) {
        i = 0;
      }
      this.dispatch(positions[i]);
      i++;
    }, 500);

  }
  dispatch(coordinates) {
    this.store.dispatch(setPosition({
      coords: {
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        latitude: coordinates[1],
        longitude: coordinates[0],
        speed: 0,
      }

    }));
  }

  stop() {
    clearInterval(this.id);
    this.id = null;
  }
}
