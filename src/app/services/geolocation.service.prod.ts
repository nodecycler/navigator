import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {geolocationError, setPosition} from '../store/position/position.actions';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private id = null;

  public position$ = this.store.select('position');

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
      this.store.dispatch(setPosition({coords}));
    }, err => {
      this.store.dispatch(geolocationError());
    }, {enableHighAccuracy: true});
  }

  stop() {
    navigator.geolocation.clearWatch(this.id);
    this.id = null;
  }
}
