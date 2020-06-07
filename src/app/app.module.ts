import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {GeolocationService} from './services/geolocation.service';
import {NeighborhoodService} from './services/neighborhood.service';
import {RouteFacadeService} from './services/routeFacade.service';
import {StoreModule} from './store/store.module';
import {NavigatorModule} from './navigator/navigator.module';
import {LoadingComponent} from './loading/loading.component';
import {ErrorComponent} from './error/error.component';
import {Store} from '@ngrx/store';
import {environment} from '../environments/environment';
import {GeolocationMockService} from './services/geolocationMock.service';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule,
    NavigatorModule,
  ],
  providers: [
    {
      provide: GeolocationService,
      useFactory: (store) => {
        if (environment.mockedGeolocation) {
          return new GeolocationMockService(store);
        } else {
          return new GeolocationService(store);
        }
      },
      deps: [ Store ]
    },
    NeighborhoodService,
    RouteFacadeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
