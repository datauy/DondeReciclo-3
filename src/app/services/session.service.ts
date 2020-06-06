import { Injectable } from '@angular/core';

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

  mapPage: boolean = false;

  // header headerState
  // breakPoint: string = "large";

  constructor() { }

  get( key: string ) {
    return this[key];
  }
  set( key: string, value: string ) {
    this[key] = value;
    return 1;
  }
}
