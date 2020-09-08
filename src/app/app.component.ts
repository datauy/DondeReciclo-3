import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SessionService } from './services/session.service';
import { NotificationsService } from './services/notifications.service';

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
    public session: SessionService,
    public notification: NotificationsService,
    private route: ActivatedRoute,
  ) {
    this.initializeApp();
    this.session = session;

    // this.route.queryParams.subscribe(params => {
    //   this.name = params['name'];
    // });
    // this.isLoading = session.isLoading;
    // if (!this.session.get('isLoading')) {
    //   this.session.set('isLoading', 'true');
    // }
    // this.isLoading = this.session.get('isLoading');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notification.notificationSetup();
    });
  }

    // La cifra al final de este bloque es la cantidad de milisegundos del loading, cargador o splash

  ngAfterViewInit() {
    setTimeout( () => {
      this.session.isLoading = false;
    }, 3000);
  }

  closeNotification() {
    this.notification.notificationClose();
  }
}
