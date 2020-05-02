import { BuscarPageModule } from './pages/buscar/buscar.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
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
import { NovedadesPageModule } from './pages/novedades/novedades.module';
import { HttpClientModule } from '@angular/common/http';

// import { Api } from './providers';

// animations
// import { SearchbarAnimation } from './pages/searchbar-animation';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({
      // navAnimation: SearchbarAnimation,
        animated: true
    }),    
    AppRoutingModule,
    ComponentsModule,
    NovedadesPageModule,
    BuscarPageModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeGeocoder,
    Geolocation,
    // Api,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
