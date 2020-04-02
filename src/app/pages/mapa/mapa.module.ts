import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Route } from '@angular/router';

import { MapaPageRoutingModule } from './mapa-routing.module';

import { LeafletComponentModule } from './../../components/leaflet/leaflet.component.module';

import { MapaPage } from './mapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPageRoutingModule,  
    LeafletComponentModule
  ],
  declarations: [MapaPage]
})
export class MapaPageModule {}
