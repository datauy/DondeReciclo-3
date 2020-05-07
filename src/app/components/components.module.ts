import { CommonModule} from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicModule, IonBackdrop } from '@ionic/angular';

import { AppRoutingModule } from '../app-routing.module';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { ModalComponent } from "./modal/modal.component";
import { SearchService } from '../services/search.service';


@NgModule({
  declarations: [
    SidemenuComponent,
    // SimpleServiceComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    AppRoutingModule,
    // SimpleServiceModule
  ],
  exports: [
    SidemenuComponent,
    // SimpleServiceComponent
  ],
  entryComponents: [
    // SimpleServiceComponent
  ],
  // schemas : [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    SearchService
  ]

})
export class ComponentsModule { }
