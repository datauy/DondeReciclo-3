import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarcasPageRoutingModule } from './marcas-routing.module';

import { MarcasPage } from './marcas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarcasPageRoutingModule
  ],
  declarations: [MarcasPage]
})
export class MarcasPageModule {}
