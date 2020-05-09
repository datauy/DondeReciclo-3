import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  container_types = [];

  constructor(private request: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  loadInitialData() {
   return  this.request.get(environment.backend + "container_types").pipe(map(
      (result: any[]) => {
        console.log('Container Types');
        console.log(result)
        return result
      }));
  }
  getNearbyContainers(location?: [number, number]) {
    if (typeof location == 'undefined') {
      location = [-32.657689, -55.873808];
    }
    return  this.request.get(environment.backend + "containers_nearby?lat="+location[0]+"&lon="+location[1]).pipe(map(
       (result: any[]) => {
         console.log('Containers Nearby');
         console.log(result)
         return result
       }));
  }
}
