import { CommonModule} from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicModule, IonBackdrop } from '@ionic/angular';

import { AppRoutingModule } from '../app-routing.module';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { SearchService } from '../services/search.service';
import { HeaderComponent } from './header/header.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AppRoutingModule
    // SimpleServiceModule
  ],
  declarations: [
    SidemenuComponent
    // SimpleServiceComponent
  ],
  exports: [
    SidemenuComponent
    // SimpleServiceComponent
  ],
  // entryComponents: [
  //   // SimpleServiceComponent
  // ],
  // schemas : [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    SearchService
  ]

})
export class ComponentsModule { }
