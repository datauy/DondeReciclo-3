import { MapaPageRoutingModule } from './mapa-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

import { navPage } from 'src/app/components/animations';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SliderComponent } from 'src/app/components/slider/slider.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { SearchComponent } from 'src/app/components/search/search.component';
import { AutoCompleteModule } from 'ionic4-auto-complete';

import { MapaPage } from './mapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    MapaPageRoutingModule,
    LeafletModule.forRoot(),
    ComponentsModule,
    AutoCompleteModule,
    //IonicModule.forRoot({
    //  navAnimation: navPage,
    //}),
  ],
  declarations: [MapaPage, SliderComponent, SearchComponent],
  exports: [ SearchComponent ],
  entryComponents: [ SearchComponent ],
  providers: [
    Keyboard
  ],
  // necesario para que funcionara
  // entryComponents: [SearchComponent],

})
export class MapaPageModule {}
