import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private request: HttpClient,
  ) { }

  async openTicket(form: any) {
    try{
      return true;
    }
    catch (error) {
      return false;
    }
  }
}
