import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '../store/store.module';
import {NavigatorComponent} from './navigator/navigator.component';
import {DestinationNodeComponent} from './destination-node/destination-node.component';
import {MapComponent} from './map/map.component';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {RouteLocatorComponent} from './route-locator/route-locator.component';
import {NearbyNodeComponent} from './nearby-node/nearby-node.component';

@NgModule({
  declarations: [
    NavigatorComponent,
    DestinationNodeComponent,
    MapComponent,
    RouteLocatorComponent,
    NearbyNodeComponent
  ],
  exports: [
    NavigatorComponent
  ],
  entryComponents: [
    NavigatorComponent,
  ],
  imports: [
    CommonModule,
    StoreModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1Ijoid2ViYmVyaWciLCJhIjoiY2s4cmFzYjFnMDFhMTNlcGVldzQxZGw1diJ9.TqIpoD7cCQNa6_QaZRZr5Q'
    }),
  ]
})
export class NavigatorModule {
}
