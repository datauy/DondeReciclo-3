import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';
import { map } from 'rxjs/operators';

import { Storage } from  '@ionic/storage';
import { User } from  'src/app/models/user';
import { AuthResponse } from  'src/app/models/auth-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authSubject  =  new  BehaviorSubject(false);
  isLogged = false as boolean;

  constructor(
    private  request:  HttpClient,
    private  storage:  Storage
  ) { }

  register(user: User): Observable<AuthResponse> {
    return this.request.post<AuthResponse>(`${environment.backend}/register`, user).pipe(
      tap(async (res:  AuthResponse ) => {
        if (res.user) {
          await this.storage.set("ACCESS_TOKEN", res.user.access_token);
          await this.storage.set("EXPIRES_IN", res.user.expires_in);
          this.isLogged = true;
          this.authSubject.next(true);
        }
      })
    );
  }

  login(user: User): Observable<AuthResponse> {
    return this.request.post(`${environment.backend}/login`, user).pipe(
      tap(async (res: AuthResponse) => {
        if (res.user) {
          await this.storage.set("ACCESS_TOKEN", res.user.access_token);
          await this.storage.set("EXPIRES_IN", res.user.expires_in);
          this.isLogged = true;
          this.authSubject.next(true);
        }
      })
    );
  }
  async logout() {
    await this.storage.remove("ACCESS_TOKEN");
    await this.storage.remove("EXPIRES_IN");
    await this.storage.remove("USER");
    await this.storage.remove("CREATED_AT");
    this.isLogged = false;
    this.authSubject.next(false);
  }

  async isLoggedIn() {
    // TODO: Chequear por EXPIRES IN
    return this.storage.get('ACCESS_TOKEN').then( (isLogged) => {
      if ( isLogged == null ) {
        return false;
      }
      this.isLogged = isLogged;
      return isLogged;
    });
  }

  createUser(form: any) {
    return this.request.post(environment.backend + "../users", form).pipe(
      map( (result: any) => {
        if (!result.error) {
          this.storage.set("USER", form.user);
          return true;
        }
        return false;
      },
    ));
  }

  loginUser( email: string, password: string) {
    return this.request.post(environment.backend + "../oauth/token", {email: email, password: password, grant_type: 'password'}).pipe(
      map( (result: any) => {
        if (!result.error) {
          this.storage.set("ACCESS_TOKEN", result.access_token);
          this.storage.set("EXPIRES_IN", result.expires_in);
          this.storage.set("CREATED_AT", result.created_at);
          this.isLogged = true;
          return true;
        }
        return false;
      },
    ));
  }
}
