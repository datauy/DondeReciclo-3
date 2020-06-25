import { CommonModule} from '@angular/common';
import { NgModule} from '@angular/core';
import { IonicModule } from '@ionic/angular';

//import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { HeaderComponent } from './header/header.component';
import { SocialShareComponent } from './social-share/social-share.component';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { NotFoundPage } from './static-pages/notfound.page';
import { AboutPage } from './static-pages/about.page';
import { ContactFormComponent } from './contact-form/contact-form.component';
//import { TestDirective } from './test.directive';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    AutoCompleteModule,
    // SimpleServiceModule
  ],
  declarations: [
    SidemenuComponent,
    HeaderComponent,
    SocialShareComponent,
    NotFoundPage,
    AboutPage,
    ContactFormComponent
  ],
  exports: [
    SidemenuComponent,
    HeaderComponent,
    SocialShareComponent,
    //TestDirective
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
