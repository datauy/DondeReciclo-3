import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { File } from '@ionic-native/file/ngx';

import { ContainerType, Container, Material, SearchParams, Program } from "src/app/models/basic_models.model";
import { News } from "src/app/models/news.model";
import { Subprogram } from "src/app/models/subprogram.model";
import { SessionService } from 'src/app/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService<T=any> {
  container_types: ContainerType[];
  containers: Container[];
  materials: Material[];
  predefinedSearch: SearchParams[];
  remoteFile: any;

  // Search
  labelAttribute = 'material_id';
  formValueAttribute = 'name';

  //Search property for non results
  constructor(
    private request: HttpClient,
    public session: SessionService,
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
  getMaterials(ids: number[]) :Material[] {
    let res = [];
    if (!this.materials) {
      this.loadMaterials();
    }
    ids.forEach(id => res.push(this.materials[id]));
    // console.log(res);
    return res;
  }
  getWastes(ids: number[]) :Observable<Material[]>  {
    return this.request.get(environment.backend + "wastes?ids=" + ids.join()).pipe(
      map( (result: Material[]) => {
        return result;
      })
    );
  }
  //
  loadMaterials(): Observable<Material[]> {
    return this.request.get(environment.backend + "materials").pipe(
      map((result: Material[]) => {
        //Check images
        /*for (let key in result) {
          // TODO: Check type
          if (result[key].icon) {
            this.downloadFile(result[key].icon, 'dr-'+result[key].class+'.svg', 'custom-icons');
          }
        }*/
        return this.materials = result;
      })
    );
  }
  //
  loadPredefinedSearch(): Observable<SearchParams[]> {
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
  loadProgramSummary() {
    return  this.request.get(environment.backend + "programs_sum").pipe(map(
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
  getContainer(id: number) {
    return  this.request.get(environment.backend + "container/"+id).pipe(map(
      (result: Container) => {
        return result;
      }
    ));
  }

  // Función genrica para cargar contenedores
  loadNearbyContainers(bounds) {
    if ( this.session.searchItem != undefined){
      return this.getContainers4Materials(bounds, this.session.searchItem.type+"="+this.session.searchItem.id);
    }
    else {
      return this.getContainers(bounds);
    }
  }

  getNearbyContainers (radius: number, location?: [number, number]) {
    if (typeof location == 'undefined') {
      location = environment[this.session.country].center;
    }
    return  this.request.get(environment.backend + "containers_nearby?lat="+location[0]+"&lon="+location[1]+"&radius="+radius).pipe(map(
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
      location = environment[this.session.country].center;
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
  getSubprograms4Location(latlng: number[]) {
    return  this.request.get(environment.backend + "subprograms4location?wkt=POINT("+latlng[1]+' '+latlng[0]+')').pipe(map(
      (result: Subprogram[]) => {
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
    return  this.request.get(environment.backend + "search?q="+str).pipe(map(
      (result: any[]) => {
        if (result.length) {
          return this.formatSearchOptions(result);
        }
        else {
          return false;
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
  //Address search
  getAddressLocation(str: string) {
    return  this.request.get(environment.geocoder + "search?q="+str+','+this.session.country+'&countrycodes='+environment[this.session.country].code+'&format=json').pipe(map(
      (result: any[]) => {
        if (result.length) {
          return this.formatAddressOptions(result);
        }
        else {
          return false;
        }
      }
    ));
  }
  //
  formatAddressOptions(addresses: any) :any[]{
  let res = [];
  addresses.forEach( (option: any) => {
    // console.log(option);
    res.push({
      id: option.place_id,
      type: option.class,
      name: option.display_name,
      class: 'address',
      bbox: [
        option.boundingbox[0] +','+ option.boundingbox[2],
        option.boundingbox[1] +','+ option.boundingbox[3]
      ],
      latlng: { lat: option.lat, lng: option.lon },
    });
  });
  return res;
  }
}
