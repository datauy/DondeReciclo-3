import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';

import { ContainerType, Container, Material, SearchParams } from "src/app/models/basic_models.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService<T> {
  container_types: ContainerType[];
  containers: Container[];
  materials: Material[];
  predefinedSearch: SearchParams[];

  constructor(private request: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  loadInitialData(): Observable<any> {
    console.log("API loading initial");
    return this.loadContainerTypes().pipe(
      switchMap( () => this.loadMaterials() ),
      switchMap( () => this.loadPredefinedSearchs() ),
    );
  }
  loadContainerTypes(): Observable<ContainerType[]> {
    return this.request.get(environment.backend + "container_types").pipe(
      map( (result: ContainerType[]) => {
        return this.container_types = result;
      },
    ));
  }
  loadMaterials(): Observable<Material[]> {
    return this.request.get(environment.backend + "materials").pipe(
      map((result: Material[]) => {
        return this.materials = result;
      })
    );
  }
  loadPredefinedSearchs(): Observable<SearchParams[]> {
    return this.request.get(environment.backend + "search_predefined").pipe(
      map((result: SearchParams[]) => {
        return this.predefinedSearch = result;
      })
    );
  }
  getNearbyContainers(location?: [number, number]) {
    if (typeof location == 'undefined') {
      location = [-32.657689, -55.873808];
    }
    return  this.request.get(environment.backend + "containers_nearby?lat="+location[0]+"&lon="+location[1]).pipe(map(
      (result: Container[]) => {
        console.log('Containers Nearby');
        console.log(result)
        return result
      }
    ));
  }
  getResults(str: string){
    if (str.length < 2) { return false; }
    return  this.request.get(environment.backend + "search?q="+str).pipe(map(
      (result: any[]) => {
        console.log('Search');
        console.log(result)
        return result
      }
    ));
  }
}
