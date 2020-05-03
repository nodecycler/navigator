import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {StoreModule} from '@ngrx/store';
import {reducers, metaReducers} from './store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {GeolocationService} from './services/geolocation.service';
import {EffectsModule} from '@ngrx/effects';
import {FetchNodesEffects} from './effects/fetchNodes.effects';
import {HttpClientModule} from '@angular/common/http';
import {CurrentRouteEffects} from './effects/currentRoute.effects';
import {NodesFacadeService} from './services/nodesFacade.service';
import {RouteFacadeService} from './services/routeFacade.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    HttpClientModule,
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    EffectsModule.forRoot([FetchNodesEffects, CurrentRouteEffects]),
  ],
  providers: [
    GeolocationService,
    NodesFacadeService,
    RouteFacadeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
