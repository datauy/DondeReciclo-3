import { Injectable } from '@angular/core';
import { Event, Router, NavigationEnd } from '@angular/router';
import { Storage } from '@ionic/storage';
import { SearchItem } from 'src/app/models/basic_models.model';
import { News } from "src/app/models/news.model";
import { BehaviorSubject } from 'rxjs';

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
  country: string;
  //Search items
  searchItem: SearchItem;
  showSearchItem: boolean = true;
  searchDimensions: Array<number> = [];
  //Initial Slider
  showSlider: boolean = false;
  reloadMap: boolean = false;
  news: {News};

  homeUrl = '/';
  lastUrl = '';
  is_mobile = false;

  _country_change = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private storage: Storage
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd ) {
        if ( event.urlAfterRedirects.split( '/' ).length > 2 ) {
          this.currentPage = event.urlAfterRedirects.split( '/' )[2];
        }
        else {
          this.currentPage = event.urlAfterRedirects.split( '/' ).pop().split('?')[0];
        }
      }
    });
  }
  //
  async isShowSlider() {
    return this.storage.get('showIntro').then( (toShow) => {
      if ( toShow == null ) {
        return true;
      }
      return toShow;
    });
  }
  //Observable as function
  get countryChanged() {
    return this._country_change;
  }
  //
  watchSlider(toShow: boolean) {
    this.storage.set('showIntro', toShow);
    this.showSlider = toShow;
  }
  //
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
  setCountry(country: string, propagate = true) {
    this.country = country;
    this.storage.set('country', country);
    this.clearCaches();
    if ( propagate ) {
      this._country_change.next(country);
    }
  }
  clearCaches() {
    this.news = null;
  }
  async getCountry(propagate = true) {
    return this.storage.get('country').then( (country) => {
      if ( country != null ) {
        this.setCountry(country, propagate);
      }
      return this.country;
    });
  }
}
