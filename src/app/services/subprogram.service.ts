
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subprogram } from '../models/subprogram.model';
import { BaseService } from './generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class SubprogramService extends BaseService<Subprogram> {

  constructor(httpClient: HttpClient) { 
    super(
      httpClient,
      environment.url,
      "subprogram");
  }
}