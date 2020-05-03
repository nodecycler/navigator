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

  constructor(private store: Store<AppState>) {
  }

  start() {
    if (this.id) {
      this.stop();
    }

    let i = 0;
    this.id = setInterval(() => {
      this.store.dispatch(setPosition({
        coords: {
          accuracy: 0,
          altitude: 0,
          altitudeAccuracy: 0,
          heading: 0,
          latitude: ACTIVITY[i][1],
          longitude: ACTIVITY[i][0],
          speed: 0,
        }
      }));
      i++;
      if (i === ACTIVITY.length) {
        i = 0;
      }
    }, 500);

  }

  stop() {
    clearInterval(this.id);
    this.id = null;
  }
}
