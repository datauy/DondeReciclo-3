import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { File } from '@ionic-native/file/ngx';

import { ContainerType, Container, Material, SearchParams } from "src/app/models/basic_models.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  container_types: ContainerType[];
  containers: Container[];
  materials: Material[];
  predefinedSearch: SearchParams[];
  suggestVisibility: boolean;
  noResultMessage: boolean;
  remoteFile: any;
  //Search property for non results
  constructor(
    private request: HttpClient,
    private file: File
  ) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
   /***************************/
  /* Initial/General Queries */
 /***************************/
 //
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
        //Check images
        for (let key in result) {
          // TODO: Check type
          if (result[key].icon) {
            this.downloadFile(result[key].icon, 'dr-'+result[key].class+'.svg', 'custom-icons');
          }
        }
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
  downloadFile(url:string, fileName: string, type: string): Observable<any> {
    console.log('Writting file assets/'+type+'/'+fileName);
    return this.request.get(url, {responseType: 'blob'}).pipe(
      mergeMap((data: Blob) => {
        return this.file.writeFile('assets/'+type, fileName, data, {replace: false});
      })
    );
  }
    /**********************/
   /*        Map         */
  /**********************/
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
  getMaterials(ids: []) :Material[] {
    let res = [];
    if (!this.materials) {
      this.loadMaterials();
    }
    ids.forEach(id => res.push(this.materials[id]));
    console.log(res);
    return res;
  }
  //
  getContainersByMaterials(ids: [], location?: [number, number]) {
  if (typeof location == 'undefined') {
    location = [-32.657689, -55.873808];
  }
  return  this.request.get(environment.backend + "containers4materials?materials="+ids.join(',')+"&lat="+location[0]+"&lon="+location[1]).pipe(map(
    (result: Container[]) => {
      return result;
    }
  ));
  }
  //
    /***********************/
   /*       Search        */
  /***********************/
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
      icon: this.materials[option.material_id].icon,
      material_id: option.material_id
    });
  });
  return res;
  }
}
