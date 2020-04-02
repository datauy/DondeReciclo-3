
import { APP_INITIALIZER, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule} from '@ionic/angular';
import { LeafletComponent } from './leaflet.component';
// import { LeafletComponentModule } from './leaflet.component.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  // imports: [
  //     CommonModule,
  //     IonicModule
  // ],
  declarations: [
      LeafletComponent
  ],
  exports: [
    LeafletComponent
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LeafletComponentModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: LeafletComponentModule
  //   };
  // }
}
