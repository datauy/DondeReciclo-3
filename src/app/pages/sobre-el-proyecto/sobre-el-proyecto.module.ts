import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SobreElProyectoPageRoutingModule } from './sobre-el-proyecto-routing.module';

import { SobreElProyectoPage } from './sobre-el-proyecto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SobreElProyectoPageRoutingModule
  ],
  declarations: [SobreElProyectoPage]
})
export class SobreElProyectoPageModule {}
