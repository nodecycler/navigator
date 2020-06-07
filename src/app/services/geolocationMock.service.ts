import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {Coords} from '../store/position/position.actions';

import {ACTIVITY} from '../../mock/activity';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationMockService {
  private id = null;
  private subject = new Subject<Coords>();

  public position$ = this.subject.asObservable();
  public improvedPosition$ = this.store.select('position');

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
    }, 1200);

  }

  private dispatch(coordinates) {
    this.subject.next(coordinates);

  }

  stop() {
    clearInterval(this.id);
    this.id = null;
  }
}
