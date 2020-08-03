import { Injectable } from '@angular/core';
import { Event, Router, NavigationEnd } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Notification } from 'src/app/models/basic_models.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // isloading for splashScreen
  isLoading: boolean = true;
  connectionProblem: boolean = false;
  // can go back
  showBackButton: boolean = false;
  urlBackButton: string = '/';
  // mapPage: boolean = false;
  tabsPage: any;
  // Page variables // TODO: corregir carga
  currentPage: string;
  cupertinoState: string = "cupertinoClosed";
  //Country
  country: string = "Uruguay";
  //Search items
  searchItem: Notification;
  searchItemBack: Notification;
  showSearchItem: boolean = true;
  //Initial Slider
  showSlider: boolean = true;

  constructor(
    private router: Router,
    private storage: Storage
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd ) {
        this.currentPage = event.urlAfterRedirects.split( '/' ).pop();
        // console.log('event: ', this.currentPage);
      }
    });
  }
  //
  async isShowSlider() {
    return this.storage.get('showSlider').then( (toShow) => {
      if ( toShow == null ) {
        return true;
      }
      return toShow;
    });
  }
  //
  watchSlider(toShow: boolean) {
    this.storage.set('showSlider', toShow);
    this.showSlider = toShow;
  }

  get( key: string ) {
    if ( this.hasOwnProperty(key) ) {
      return this[key];
    }
    else {
      return 0;
    }
  }

  set( key: string, value: any ) {
    this[key] = value;
    return 1;
  }
  /*****  SEARCH NOTIFICATIONS  *******/
  showNotification(notification: Notification) {
    console.log(notification);
    if ( this.searchItem ) {
      this.searchItemBack = this.searchItem;
    }
    this.searchItem = notification;
  }
  notificationClose() {
    if ( this.searchItemBack ) {
      this.searchItem = this.searchItemBack;
      delete this.searchItemBack;
    }
    else {
      delete this.searchItem
    }
  }
  notificationCommingSoon() {
    console.log('Comming soon');
    let notification = {
      id: null,
      type: 'notification',
      class: 'warnings',
      name: 'Funcionalidad disponible en breve',
      deposition: 'Registrate para enterarte apenas esté disponible.'
    };
    this.showNotification(notification);
  }
}
