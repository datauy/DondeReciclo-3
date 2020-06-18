import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SobreElProyectoPageRoutingModule } from './sobre-el-proyecto-routing.module';

import { SobreElProyectoPage } from './sobre-el-proyecto.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SobreElProyectoPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [SobreElProyectoPage]
})
export class SobreElProyectoPageModule {}
