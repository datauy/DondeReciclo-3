import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsnavPageRoutingModule } from './tabsnav-routing.module';
import { TabsnavPage } from './tabsnav.page';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SliderComponent } from './../../components/slider/slider.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { SearchComponent } from 'src/app/components/search/search.component';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { navPage } from 'src/app/components/animations';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot({
      navAnimation: navPage,
        // animated: true
    }),
    TabsnavPageRoutingModule,
    ComponentsModule,
    AutoCompleteModule,
  ],
  exports: [
    SearchComponent,
  ],
  declarations: [TabsnavPage, SliderComponent, SearchComponent],
  providers: [
    Keyboard
  ],
  entryComponents: [SearchComponent],
})
export class TabsnavPageModule {}
