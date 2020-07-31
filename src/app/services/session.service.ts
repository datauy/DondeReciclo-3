import { Injectable } from '@angular/core';
import { Event, Router, NavigationEnd } from '@angular/router';
import { Storage } from '@ionic/storage';

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
  searchItem: any;
  showSearchItem: boolean = true;
  //Initial Slider
  showSlider: boolean;

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

  ngOnInit() {
    this.storage.get('showSlider').then( (toShow) => {
      this.showSlider = toShow;
    });
  }
  //
  async isShowSlider() {
    return this.storage.get('showSlider').then( (toShow) => {
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
}
