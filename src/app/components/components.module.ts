import { CommonModule} from '@angular/common';
import { NgModule} from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { AppRoutingModule } from '../app-routing.module';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { LeafletComponent } from './leaflet/leaflet.component'; 

@NgModule({
  declarations: [
    SidemenuComponent,
    LeafletComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    AppRoutingModule
  ],
  exports: [
    SidemenuComponent,
    LeafletComponent
  ]
})
export class ComponentsModule { }