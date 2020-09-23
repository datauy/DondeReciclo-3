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
  createReport(form: any): Observable<boolean> {
    if ( this.auth.isLogged ) {
      let body = form;
      let options = {
        headers: {
          'Authorization': "Bearer "+ this.auth.user_token
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
}
