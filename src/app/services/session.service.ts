import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // isloading for splashScreen
  isLoading: boolean = true;
  connectionProblem: boolean = false;

  constructor() { }

  get( key: string ) {
    return this[key];
  }
  set( key: string, value: string ) {
    this[key] = value;
    return 1;
  }
}
