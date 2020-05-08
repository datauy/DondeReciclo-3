
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

// import { NeighbourService } from '../../services/neighbour.service';

import { MapaPageRoutingModule } from './mapa-routing.module';

import { LeafletModule } from "@asymmetrik/ngx-leaflet";

import { MapaPage } from './mapa.page';

import { SearchComponent } from 'src/app/components/search/search.component';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { SearchService } from 'src/app/services/search.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    MapaPageRoutingModule,
    LeafletModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: MapaPage
      }
    ]),
    // SimpleServiceModule,
    AutoCompleteModule,
  ],
  exports: [
    SearchComponent
  ],
  declarations: [MapaPage, SearchComponent],

  // necesario para que funcionara
  entryComponents: [SearchComponent],
  // providers: [
  //   SearchService
  // ]
})
export class MapaPageModule {}
