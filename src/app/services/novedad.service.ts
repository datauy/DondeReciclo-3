
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Novedad } from '../models/novedad.model';
import { BaseService } from './generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class NovedadService extends BaseService<Novedad> {

  constructor(httpClient: HttpClient) { 
    super(
      httpClient,
      environment.url,
      "novedad");
  }
}