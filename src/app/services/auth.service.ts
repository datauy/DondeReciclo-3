import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
//import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';
import { map } from 'rxjs/operators';

import { Storage } from  '@ionic/storage';
import { User } from  'src/app/models/user';
//import { AuthResponse } from  'src/app/models/auth-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authSubject  =  new  BehaviorSubject(false);
  isLogged = false as boolean;
  user: User;
  user_token: string;
  constructor(
    private  request:  HttpClient,
    private  storage:  Storage
  ) { }

  async logout() {
    Promise.all([
      this.storage.remove("ACCESS_TOKEN"),
      this.storage.remove("EXPIRES_IN"),
      this.storage.remove("USER"),
      this.storage.remove("CREATED_AT")
    ]).then( () => {
      this.isLogged = false;
      delete this.user;
      delete this.user_token;
      this.authSubject.next(false);
    });
  }

  async isLoggedIn(): Promise<boolean> {
    let token = this.storage.get('ACCESS_TOKEN');
    let token_expires = this.storage.get("EXPIRES_IN");
    let token_created = this.storage.get("CREATED_AT");
    return Promise.all([token, token_expires, token_created])
    .then( (token) => {
      if (
        token[0] != null &&
        token[1] + token[2] - (new Date).getTime() / 1000 > 0
      ) {
        this.user_token = token[0];
        return this.isLogged = true;
      }
      return false;
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
          Promise.all([
            this.storage.set("ACCESS_TOKEN", result.access_token),
            this.storage.set("EXPIRES_IN", result.expires_in),
            this.storage.set("CREATED_AT", result.created_at)
          ])
          .then( (values) => {
            this.loadUserData();
            this.isLogged = true;
            this.user_token = result.access_token;
          });
          return true;
        }
        return false;
      },
    ));
  }
  async loadUserData(): Promise<User> {
    return this.storage.get('USER').then( (user) => {
      if (user) {
        this.storage.get('ACCESS_TOKEN').then( ( token ) => {
          if (token) {
            this.isLogged = true;
            this.user_token = token;
          }
          else {
            return false;
          }
        });
        this.user = user;
        return user;
      }
      else {
        return this.isLoggedIn().then(
          (isLogged) => {
            if (isLogged) {
              let options = {
                headers: {
                  'Authorization': "Bearer " + this.user_token
               },
              };
              return this.request.get(
                environment.backend + "user", options
              )
              .toPromise()
              .then( (result: any) => {
                  if (!result.error) {
                    this.storage.set('USER', result);
                    this.user = result;
                    return result;
                  }
                  return false;
                })
              .catch( (e) => {console.log('ERROR');console.log(e)});
            }
            else {
              return false;
            }
          }
        );
      }
    })
    .catch( (e) => {console.log('ERROR');console.log(e)});
  }
}
