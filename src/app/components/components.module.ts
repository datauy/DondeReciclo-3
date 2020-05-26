import { CommonModule} from '@angular/common';
import { NgModule} from '@angular/core';
import { IonicModule } from '@ionic/angular';

//import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { HeaderComponent } from './header/header.component';
import { SocialShareComponent } from './social-share/social-share.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
    // SimpleServiceModule
  ],
  declarations: [
    SidemenuComponent,
    HeaderComponent,
    SocialShareComponent
    // SimpleServiceComponent
  ],
  exports: [
    SidemenuComponent,
    HeaderComponent,
    SocialShareComponent
    // SimpleServiceComponent
  ],
  entryComponents: [
    SocialShareComponent,
    // SimpleServiceComponent
  ],
  // schemas : [CUSTOM_ELEMENTS_SCHEMA],
  providers: []

})
export class ComponentsModule {
}
