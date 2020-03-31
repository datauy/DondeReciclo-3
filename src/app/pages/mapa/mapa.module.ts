import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaPageRoutingModule } from './mapa-routing.module';

import { MapaPage } from './mapa.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPageRoutingModule
  ],
  declarations: [MapaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapaPageModule {}
