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
  suggestVisibility: boolean;
  noResultMessage: boolean;
  //Search property for non results
  labelAttribute = 'Se podrá con HTML???';
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
  //
  loadContainerTypes(): Observable<ContainerType[]> {
    return this.request.get(environment.backend + "container_types").pipe(
      map( (result: ContainerType[]) => {
        return this.container_types = result;
      },
    ));
  }
  //
  loadMaterials(): Observable<Material[]> {
    return this.request.get(environment.backend + "materials").pipe(
      map((result: Material[]) => {
        return this.materials = result;
      })
    );
  }
  //
  loadPredefinedSearchs(): Observable<SearchParams[]> {
    this.suggestVisibility = true;
    this.noResultMessage = false;
    return this.request.get(environment.backend + "search_predefined").pipe(
      map((result: SearchParams[]) => {
        return this.predefinedSearch = this.formatSearchOptions(result);
      })
    );
  }
  //
  getNearbyContainers(location?: [number, number]) {
    if (typeof location == 'undefined') {
      location = [-32.657689, -55.873808];
    }
    return  this.request.get(environment.backend + "containers_nearby?lat="+location[0]+"&lon="+location[1]).pipe(map(
      (result: Container[]) => {
        return result;
      }
    ));
  }
  //
  getResults(str: string){
    if (str.length < 2) {
      this.suggestVisibility = true;
      this.noResultMessage = false;
      return false;
    }
    return  this.request.get(environment.backend + "search?q="+str).pipe(map(
      (result: any[]) => {
        if (result.length) {
          this.suggestVisibility = false;
          this.noResultMessage = false;
          return this.formatSearchOptions(result);
        }
        else {
          this.suggestVisibility = true;
          this.noResultMessage = true;
          return [];
        }
      }
    ));
  }
  //
  formatSearchOptions(options: SearchParams[]) :any[]{
    let res = [];
    options.forEach( (option) => {
      if (!option.material_id){
        option.material_id = 5;
      }
      res.push({
        class: this.materials[option.material_id].class,
        name: option.name,
      });
    });
    return res;
  }
  //
  getMaterials(ids: []) :Material[] {
    let res = [];
    if (!this.materials) {
      this.loadMaterials();
    }
    ids.forEach(id => res.push(this.materials[id]));
    console.log(res);
    return res;
  }
}
