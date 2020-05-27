import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  backdropDismiss = true;
  showBackdrop = false;
  shouldPropagate = false;

  // isLoading: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public session: SessionService
  ) {
    this.initializeApp();
    this.session = session;
    // this.isLoading = session.isLoading;
    // if (!this.session.get('isLoading')) {
    //   this.session.set('isLoading', 'true');
    // }
    // this.isLoading = this.session.get('isLoading');
    console.log("isloading 1: ", this.session.isLoading);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngAfterViewInit() {
    setTimeout( () => {
      // this.session.set('isLoading', 'false');
      // this.isLoading = false;
      this.session.isLoading = false;
      console.log("isloading app: ", this.session.isLoading);
    }, 2000);
  }
}
