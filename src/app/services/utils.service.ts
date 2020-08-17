import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { File } from '@ionic-native/file/ngx';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  progress: number;

  constructor(
    private request: HttpClient,
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
  createReport(form: any): Observable<any> {
    let body = form;
    let options = {};
    console.log("REPORTE");
    if ( form.file ) {
      body = form.file;
      form.MimeType = form.fileType.type;
      form.ClientFilename = form.fileType.name;
      let type = form.fileType.type;
      delete  form.file;
      delete  form.fileType;
      options = {
        headers: { "Content-Type": type },
        params: form
      };
      console.log(options);
    }
    console.log(options);
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
