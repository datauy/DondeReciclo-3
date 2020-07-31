import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';

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
    private  httpClient:  HttpClient,
    private  storage:  Storage
  ) { }

  register(user: User): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${environment.backend}/register`, user).pipe(
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
    return this.httpClient.post(`${environment.backend}/login`, user).pipe(
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
    this.isLogged = false;
    this.authSubject.next(false);
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}
