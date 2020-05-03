import {Injectable} from '@angular/core';

declare global {
  interface Navigator {
    requestWakeLock: (resourceName: string) => void;
  }

  interface Window {
    plugins: {
      [key: string]: any
    };
  }
}
@Injectable({
  providedIn: 'root'
})
export class WakeLockService {

  constructor() {
  }

  start() {
    // @todo: https://whatwebcando.today/wake-lock.html
    if (window.navigator && window.navigator.requestWakeLock) {
      console.info('Requesting wakelock for screen...');
      window.navigator.requestWakeLock('screen');
    } else if (window.plugins && window.plugins.hasOwnProperty('insomnia')) {
      console.info('Found insomnia plugin, calling keepAwake...');
      window.plugins.insomnia.keepAwake();
    }

  }
}
