import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramasPageRoutingModule } from './programas-routing.module';

import { ProgramasPage } from './programas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramasPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [ProgramasPage]
})
export class ProgramasPageModule {}
