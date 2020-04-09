import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCompartirPage } from './modal-compartir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ModalCompartirPage],
  entryComponents: [
    ModalCompartirPage
  ]
})
export class ModalCompartirPageModule {}
