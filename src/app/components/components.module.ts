import { CommonModule} from '@angular/common';
import { NgModule} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { HeaderComponent } from './header/header.component';
import { SocialShareComponent } from './social-share/social-share.component';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { NotFoundPage } from './static-pages/notfound.page';
import { AboutPage } from './static-pages/about.page';
import { PrivacyPolicyPage } from './static-pages/privacy_policy.page';
import { RecyclersPage } from './static-pages/recyclers.page';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { AccordionComponent } from './accordion/accordion.component';
import { NotificationComponent } from './notification/notification.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { MaterialsChipsComponent } from './materials-chips/materials-chips.component';
import { WalkthroughComponent } from './walkthrough/walkthrough.component';
//import { TestDirective } from './test.directive';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule
    // SimpleServiceModule
  ],
  declarations: [
    SidemenuComponent,
    HeaderComponent,
    SocialShareComponent,
    NotFoundPage,
    AboutPage,
    PrivacyPolicyPage,
    RecyclersPage,
    ContactFormComponent,
    AccordionComponent,
    NotificationComponent,
    ImageSliderComponent,
    MaterialsChipsComponent,
    WalkthroughComponent
  ],
  exports: [
    SidemenuComponent,
    HeaderComponent,
    SocialShareComponent,
    AccordionComponent,
    ImageSliderComponent,
    MaterialsChipsComponent,
    WalkthroughComponent
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
