import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsnavPageRoutingModule } from './tabsnav-routing.module';

import { TabsnavPage } from './tabsnav.page';

import { Keyboard } from '@ionic-native/keyboard/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsnavPageRoutingModule
  ],
  declarations: [TabsnavPage],
  providers: [
    Keyboard
  ]
})
export class TabsnavPageModule {}
