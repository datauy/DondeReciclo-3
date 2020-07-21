import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { File } from '@ionic-native/file/ngx';

import { ContainerType, Container, Material, SearchParams, Program } from "src/app/models/basic_models.model";
import { News } from "src/app/models/news.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService<T=any> {
  container_types: ContainerType[];
  containers: Container[];
  materials: Material[];
  predefinedSearch: SearchParams[];
  suggestVisibility: boolean;
  noResultMessage: boolean;
  remoteFile: any;

  // Search
  labelAttribute = 'material_id';
  formValueAttribute = 'name';

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
    // console.log("API loading initial");
    return this.loadContainerTypes().pipe(
      switchMap( () => this.loadMaterials() ),
      switchMap( () => this.loadPredefinedSearch() ),
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
  getMaterials(ids: []) :Material[] {
    let res = [];
    if (!this.materials) {
      this.loadMaterials();
    }
    ids.forEach(id => res.push(this.materials[id]));
    // console.log(res);
    return res;
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
  loadPredefinedSearch(): Observable<SearchParams[]> {
    this.suggestVisibility = true;
    this.noResultMessage = false;
    return this.request.get(environment.backend + "search_predefined").pipe(
      map((result: SearchParams[]) => {
        return this.predefinedSearch = this.formatSearchOptions(result);
      })
    );
  }
  downloadFile(url:string, fileName: string, type: string): Observable<any> {
    // console.log('Writting file assets/'+type+'/'+fileName);
    return this.request.get(url, {responseType: 'blob'}).pipe(
      mergeMap((data: Blob) => {
        return this.file.writeFile('assets/'+type, fileName, data, {replace: false});
      })
    );
  }
  loadPrograms() {
    return  this.request.get(environment.backend + "programs").pipe(map(
      (result: Program[]) => {
        return result;
      }
    ));
  }
    /**********************/
   /*        News         */
  /**********************/
  //
  getNewsList(page: number) {
    return  this.request.get(environment.backend + "news?page="+page).pipe(map(
      (result: News[]) => {
        return result;
      }
    ));
  }
  //
  getNew(id: number, full: boolean) {
    var url = environment.backend + "new/"+id;
    if (full) {
      url += "?full=1"
    }
    console.log(url);
    return  this.request.get(url).pipe(map(
      (result: News) => {
        return result;
      }
    ));
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
  getContainers(bbox: string[]) {
    return  this.request.get(environment.backend + "containers_bbox?sw="+bbox[0]+"&ne="+bbox[1]).pipe(map(
      (result: Container[]) => {
        return result;
      }
    ));
  }
  getContainers4Materials(bbox: string[], query: string) {
    return  this.request.get(environment.backend + "containers_bbox4materials?sw="+bbox[0]+"&ne="+bbox[1]+"&"+query).pipe(map(
      (result: Container[]) => {
        return result;
      }
    ));
  }
  //
  getContainersByMaterials(query: string, location?: number[]) {
    var url = environment.backend + "containers4materials?"+query;
    if ( typeof location == 'undefined' || location == null ) {
      location = environment.ucenter;
    }
    else {
      // TODO: Definir comportamiento en base a caso de uso ya que cambia la query del back también
    }
    url += "&lat="+location[0]+"&lon="+location[1];
    return  this.request.get(url).pipe(map(
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
    }else{
      this.suggestVisibility = false;
    }
    return  this.request.get(environment.backend + "search?q="+str).pipe(map(
      (result: any[]) => {
        if (result.length) {
          this.noResultMessage = false;
          // if (result.length > 1) {
          //   this.suggestVisibility = false;
          // }
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
    // console.log(option);
    if (!option.material_id){
      option.material_id = 5;
    }
    res.push({
      id: option.id,
      type: option.type,
      name: option.name,
      material_id: option.material_id,
      class: this.materials[option.material_id].class,
      icon: this.materials[option.material_id].icon,
      deposition: option.deposition,
    });
  });
  return res;
  }
}
