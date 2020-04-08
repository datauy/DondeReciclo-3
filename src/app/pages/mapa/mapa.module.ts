
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';

import { NeighbourService } from '../../services/neighbour.service';

import { MapaPageRoutingModule } from './mapa-routing.module';

import { LeafletModule } from "@asymmetrik/ngx-leaflet";

import { MapaPage } from './mapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    MapaPageRoutingModule, 
    LeafletModule.forRoot()
  ],
  providers: [
    NeighbourService
  ],
  declarations: [MapaPage]
})
export class MapaPageModule {}
