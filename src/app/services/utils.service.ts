import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private request: HttpClient,
  ) { }

  openTicket(form: any) {
    try{
      return this.request.post(environment.backend + "contact", form).pipe(
        map( (result: any) => {
          console.log('VUELVE DEL POST:');
          console.log(result);
          if (!result.error) {
            return true;
          }
          return false;
        },
      ));
    }
    catch (error) {
      return false;
    }
  }
}
