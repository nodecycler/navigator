import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {Coords, geolocationError} from '../store/position/position.actions';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private id = null;

  private subject = new Subject<Coords>();

  public position$ = this.subject.asObservable();
  public improvedPosition$ = this.store.select('position');

  constructor(private store: Store<AppState>) {
  }


  start() {
    if (!navigator.geolocation) {
      this.store.dispatch(geolocationError());
      return;
    }
    if (this.id) {
      this.stop();
    }

    this.id = navigator.geolocation.watchPosition(({coords}) => {
      this.subject.next([coords.longitude, coords.latitude]);
    }, err => {
      this.store.dispatch(geolocationError());
    }, {enableHighAccuracy: true});
  }

  stop() {
    navigator.geolocation.clearWatch(this.id);
    this.id = null;
  }
}
