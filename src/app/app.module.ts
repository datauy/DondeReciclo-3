//import { NgModule, APP_INITIALIZER} from '@angular/core';
import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ComponentsModule } from './components/components.module';

// Geo
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

// API
import { HttpClientModule } from '@angular/common/http';

import { ApiService } from './services/api.service';

import { File } from '@ionic-native/file/ngx';
import { navPage } from './components/animations/';

/*
export function initApp(backConfig: ApiService<any>) {
  console.log("Loading initial data");
   return () => backConfig.loadInitialData();
}
*/
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      navAnimation: navPage,
        // animated: true
    }),
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeGeocoder,
    Geolocation,
    ApiService,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
//    { provide: APP_INITIALIZER, useFactory: initApp, deps: [ApiService], multi: true }
  ],
  bootstrap: [AppComponent],
  // schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
