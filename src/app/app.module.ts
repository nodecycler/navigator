import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {GeolocationService} from './services/geolocation.service';
import {NodesFacadeService} from './services/nodesFacade.service';
import {RouteFacadeService} from './services/routeFacade.service';
import {StoreModule} from './store/store.module';
import {NavigatorModule} from './navigator/navigator.module';
import {LoadingComponent} from './loading/loading.component';
import {ErrorComponent} from './error/error.component';

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
    GeolocationService,
    NodesFacadeService,
    RouteFacadeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
