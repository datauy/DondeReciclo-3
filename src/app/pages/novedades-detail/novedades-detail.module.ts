import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NovedadesDetailPageRoutingModule } from './novedades-detail-routing.module';

import { NovedadesDetailPage } from './novedades-detail.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NovedadesDetailPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [NovedadesDetailPage]
})
export class NovedadesDetailPageModule {}
