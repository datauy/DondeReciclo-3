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
  //
  requestToken(email: any) {
    return this.request.post( environment.backend + "../password/forgot", email ).pipe(
      map( (result: any) => {
        if (!result.error) {
          return true;
        }
        return false;
      },
    ));
  }
  //
  sendPass(data: any) {
    return this.request.post( environment.backend + "../password/reset", data ).pipe(
      map( (result: any) => {
        if (!result.error) {
          return true;
        }
        return false;
      },
    ));
  }
  //
  async logout() {
    Promise.all([
      this.storage.remove("ACCESS_TOKEN"),
      this.storage.remove("EXPIRES_IN"),
      this.storage.remove("CREATED_AT")
    ]).then( () => {
      this.isLogged = false;
      delete this.user;
      delete this.user_token;
      this.authSubject.next(false);
    });
  }
  //
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
  //
  createUser(form: any) {
    return this.request.post(environment.backend + "../users", form).pipe(
      map( (result: any) => {
        if (!result.error) {
          //Remove sensitive data
          delete form.user.password;
          delete form.user.confirmPassword;
          this.user = form.user;
          return true;
        }
        return false;
      },
    ));
  }
  //
  async updateUser(user: User): Promise<boolean> {
    return this.isLoggedIn().then(
      (isLogged) => {
        if (isLogged) {
          let options = {
            headers: {
              'Authorization': "Bearer " + this.user_token
            },
          };
          return this.request.post(environment.backend + "user/update", user, options)
          .toPromise()
          .then( (result: any) => {
              if (!result.error) {
                this.user = result;
                return true;
              }
              return false;
            })
          .catch( (e) => {
            console.log('ERROR');
            console.log(e)
            return false;
          });
        }
        else {
          return false;
        }
      }
    )
    .catch( (e) => {
      console.log('ERROR');
      console.log(e)
      return false;
    });
  }
  //
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
            this.user_token = result.access_token;
          });
          this.isLogged = true;
          return true;
        }
        return false;
      },
      () => {
        return false;
      }
    ));
  }
  async loadUserData(): Promise<User> {
    return this.isLoggedIn().then(
      (isLogged) => {
        if (isLogged) {
          if ( this.user ) {
            return this.user;
          }
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
}
