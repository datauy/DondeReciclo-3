import { Injectable, ViewChild } from '@angular/core';
import { Event, Router, NavigationEnd } from '@angular/router';
import { IonTabs } from '@ionic/angular';

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

  currentPage: string;
  cupertinoState: string = "cupertinoClosed";

  @ViewChild("tabsNav", {
    static: false
  }) tabsNav: IonTabs;


  // @ViewChild("tabsNav", {
  //   static: false
  // }) tabsNav: IonTabs;
  // header headerState
  // breakPoint: string = "large";

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd ) {
        this.currentPage = event.urlAfterRedirects.split( '/' ).pop();
        // console.log('event: ', this.currentPage);
      }
    });

    // console.log(this.tabsNav);
    // this.route.queryParams.subscribe(params => {
    //   this.currentPage = params;
    //   console.log('current page service: ', this.currentPage)
    // });
  }

  get( key: string ) {
    return this[key];
  }
  set( key: string, value: string ) {
    this[key] = value;
    return 1;
  }
}
