import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NovedadesPageRoutingModule } from './novedades-routing.module';

import { NovedadesPage } from './novedades.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NovedadesPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [NovedadesPage]
})
export class NovedadesPageModule {}
