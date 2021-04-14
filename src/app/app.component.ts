import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SessionService } from './services/session.service';
import { NotificationsService } from './services/notifications.service';
import { UtilsService } from './services/utils.service';

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
    public session: SessionService,
    public utils: UtilsService,
    public notification: NotificationsService,
    private router: Router,
  ) {
    this.initializeApp();
    this.session = session;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.notification.notificationSetup();
    });
    let ua = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      this.session.is_mobile = true;
    }
  }

    // La cifra al final de este bloque es la cantidad de milisegundos del loading, cargador o splash

  ngAfterViewInit() {
    if ( this.session.country == undefined || this.session.country == '' ) {
      if ( window.location.host == 'dondereciclo.co' ) {
        this.session.country = 'Colombia'
      }
      else {
        if ( window.location.host == 'dondereciclo.uy' ) {
          this.session.country = 'Uruguay'
        }
      }
    }
    setTimeout( () => {
      this.session.isLoading = false;
    }, 3000);
  }
  overlayClose() {
    this.utils.showOverlay = false;
  }
}
