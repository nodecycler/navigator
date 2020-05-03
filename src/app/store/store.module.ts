import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {metaReducers, reducers} from './index';
import {HttpClientModule} from '@angular/common/http';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../../environments/environment';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule as NgRxStoreModule} from '@ngrx/store';
import {FetchNodesEffects} from '../effects/fetchNodes.effects';
import {CurrentRouteEffects} from '../effects/currentRoute.effects';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgRxStoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    HttpClientModule,
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    EffectsModule.forRoot([FetchNodesEffects, CurrentRouteEffects]),
  ]
})
export class StoreModule { }
