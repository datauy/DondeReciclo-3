import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { File } from '@ionic-native/file/ngx';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  progress: number;
  photos: string[];
  showPhotos: boolean;
  //
  showOverlay: boolean = false;

  constructor(
    private request: HttpClient,
    private auth: AuthService,
  ) { }

  openTicket(form: any) {
    return this.request.post(environment.backend + "contact", form).pipe(
      map( (result: any) => {
        if (!result.error) {
          return true;
        }
        return false;
      },
    ));
  }
  //
  collectRequest(form: any) {
    if ( this.auth.isLogged ) {
      let options = {
        headers: {
          'Authorization': "Bearer "+ this.auth.user_token
        }
      };
      return this.request.post(environment.backend + "collect", form, options).
      pipe(
        map( (result: any) => {
          if (!result.error) {
            return true;
          }
          return false;
        })
      );
    }
  }
  //
  createReport(form: any): Observable<boolean> {
    let body = form;
    let options = {
      headers: {
      }
    };
    if ( form.file ) {
      body = form.file;
      form.MimeType = form.fileType.type;
      form.ClientFilename = form.fileType.name;
      let type = form.fileType.type;
      delete  form.file;
      delete  form.fileType;
      options.headers["Content-Type"] = type;
      options['params'] = form;
    }
    return this.request.post(
      environment.backend + "report", body, options
    ).pipe(
      map( (result: any) => {
        if (!result.error) {
          return true;
        }
        return false;
      })
    );
  }
  //
  uploadImage(image: any, imageData: any, id): Observable<boolean> {
    if ( this.auth.isLogged ) {
      let params = {
        comment: environment.backend + '../admin/containers/'+id+'/edit',
        subject: 'foto',
        MimeType: imageData.type,
        ClientFilename: imageData.name,
      }
      let options = {
        headers: {
          "Content-Type": imageData.type,
          'Authorization': "Bearer "+ this.auth.user_token
       },
        params: params
      };
      return this.request.post(
        environment.backend + "report", image, options
      ).pipe(
        map( (result: any) => {
          if (!result.error) {
            return true;
          }
          return false;
        })
      );
    }
  }
  validateForm(user_data: any) {
    let res = true;
    if ( !user_data.valid ) {
      let res = false;
      Object.keys(user_data.controls).forEach(
        control_key => {
          if ( user_data.controls[control_key].invalid ) {
            user_data.controls[control_key].setError();

          }
        }
      );
    }
    return res;
  }
}
