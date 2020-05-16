import { MapaPageRoutingModule } from './mapa-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

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
    // commented out by Bruno, this is redundant, right?
    // RouterModule.forChild([
    //   {
    //     path: '',
    //     component: MapaPage
    //   }
    // ]),
    // ComponentsModule,
    // SimpleServiceModule,
  ],
  // exports: [
  //   SearchComponent,
  // ],
  declarations: [MapaPage],

  // necesario para que funcionara
  // entryComponents: [SearchComponent],

})
export class MapaPageModule {}
