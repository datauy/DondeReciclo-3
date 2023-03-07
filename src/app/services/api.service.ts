import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin} from 'rxjs';
import { Observable, BehaviorSubject } from 'rxjs';
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
  materials: {[index:string] : Material[]} = {};
  programs: Program[]
  remoteFile: any;

  // Search
  labelAttribute = 'material_id';
  formValueAttribute = 'name';

  _initial_data_loaded = new BehaviorSubject<boolean>(false);
  //Search property for non results
  constructor(
    private request: HttpClient,
    public session: SessionService,
    private file: File
  ) {
    this.loadInitialData().subscribe(()=>{
      this._initial_data_loaded.next(true);
    });
  }
  get initialDataLoaded() {
    return this._initial_data_loaded;
  }
  //
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  params = new HttpParams().set( "version", environment.apiVersion);
   /***************************/
  /* Initial/General Queries */
 /***************************/
 //
  loadInitialData(): Observable<any> {
    return forkJoin([
      this.loadCountries(),
      this.loadContainerTypes(),
      this.loadMaterials('Uruguay'),
      this.loadMaterials('Colombia'),
      this.loadProgramSummary()
    ]);
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
  getWastes(ids: number[]) :Observable<Material[]>  {
    return this.request.get(environment.backend + "wastes?version="+environment.apiVersion+"&locale=" + environment[this.session.country].locale + "&ids=" + ids.join()).pipe(
      map( (result: Material[]) => {
        return result;
      })
    );
  }
  //
  loadMaterials(country: string): Observable<Material[]> {
    return this.request.get(environment.backend + "materials?version="+environment.apiVersion+"&locale=" + environment[country].locale).pipe(map(
      (result: Material[]) => {
        //Check images
        //for (let key in result) {
          // TODO: Check type
          //if (result[key].icon) {
            //this.downloadFile(result[key].icon, 'dr-'+result[key].class+'.svg', 'custom-icons');
          //}
        //}
        return this.materials[country] = result;
      }
    ));
  }
  //
  loadCountries(): Observable<any> {
    return this.request.get(environment.backend + "countries?version="+environment.apiVersion).pipe(
      map((result: SearchParams[]) => {
        result.forEach(
          (country) => {
            environment[country.name] = country;
          }
        );
        return true;
      })
    );
  }
  //
  downloadFile(url:string, fileName: string, type: string): Observable<any> {
    // console.log('Writting file assets/'+type+'/'+fileName);
    return this.request.get(url, {responseType: 'blob'}).pipe(
      mergeMap((data: Blob) => {
        return this.file.writeFile('assets/'+type, fileName, data, {replace: false});
      })
    );
  }
  loadTagsPrograms() {
    return  this.request.get(environment.backend + "tags_programs?version="+environment.apiVersion).pipe(map(
      ( result: {name: string, programs: Program[]} ) => {
        return result;
      }
    ));
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
        return this.programs = result;
      }
    ));
  }
    /**********************/
   /*        News         */
  /**********************/
  //
  getNewsList(page: number, country: string) {
    return  this.request.get(environment.backend + "news?version="+environment.apiVersion+"&country="+ country +"&page="+ page).pipe(map(
      (result: News[]) => {
        return result;
      }
    ));
  }
  //
  getNew(id: number, full: boolean) {
    var url = environment.backend + "new/"+id;
    if (full) {
      url += "?version="+environment.apiVersion+"&full=1"
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
      let ids = this.session.searchItem.ids !== undefined ? this.session.searchItem.ids : this.session.searchItem.id;
      return this.getContainers4Materials(bounds, this.session.searchItem.type+"="+ids);
    }
    else {
      return this.getContainers(bounds);
    }
  }

  getNearbyContainers (radius: number, location?: [number, number]): Observable<any> {
    if (typeof location == undefined) {
      location = environment[this.session.country].center;
    }
    return  this.request.get(environment.backend + "containers_nearby?version="+environment.apiVersion+"&lat="+location[0]+"&lon="+location[1]+"&radius="+radius).pipe(map(
      (result: Container[]): Container[] => {
        return this.formatMarker(result);
      }
    ));
  }

  getContainers(bbox: string[]) {
    return  this.request.get(environment.backend + "containers_bbox?version="+environment.apiVersion+"&sw="+bbox[0]+"&ne="+bbox[1]).pipe(map(
      (result: Container[]) => {
        return this.formatMarker(result);
      }
    ));
  }
  getContainers4Materials(bbox: string[], query: string) {
    return  this.request.get(environment.backend + "containers_bbox4materials?version="+environment.apiVersion+"&sw="+bbox[0]+"&ne="+bbox[1]+"&"+query).pipe(map(
      (result: Container[]) => {
        return this.formatMarker(result);
      }
    ));
  }
  //
  getContainersByMaterials(query: string, location?: number[]) {
    var url = environment.backend + "containers4materials?version="+environment.apiVersion+"&"+query;
    if ( typeof location == 'undefined' || location == null ) {
      location = environment[this.session.country].center;
    }
    else {
      // TODO: Definir comportamiento en base a caso de uso ya que cambia la query del back también
    }
    url += "&lat="+location[0]+"&lon="+location[1];
    return  this.request.get(url).pipe(map(
      (result: Container[]) => {
        return this.formatMarker(result);
      }
    ));
  }
  getSubContainers(subs: string) {
    return  this.request.get(environment.backend + "subprogram_containers?version="+environment.apiVersion+"&sub_ids="+subs).pipe(map(
      (result: Container[]) => {
        return this.formatMarker(result);
      }
    ));
  }
  getContainersIds(cids: string) {
    return  this.request.get(environment.backend + "containers?version="+environment.apiVersion+"&container_ids="+cids).pipe(map(
      (result: Container[]) => {
        return this.formatMarker(result);
      }
    ));
  }
  getSubprograms4Location(latlng: number[], distance?: number, dimensions?: string) {
    let ids = null;
    if ( this.session.searchItem != undefined){
      ids = this.session.searchItem.ids != undefined ? this.session.searchItem.ids : this.session.searchItem.id;
    }
    var req = environment.backend + "subprograms4location?version="+environment.apiVersion+"&wkt=POINT("+latlng[1]+' '+latlng[0]+')';
    if ( distance != null ) {
      req += '&distance=' + distance;
    }
    if ( this.session.searchDimensions.length >= 1 && ids !== null ) {
      req += '&dimensions=' + ids;
    }
    return  this.request.get(req).pipe(map(
      (result: any) => {
        return result;
      }
    ));
  }
  getSubprogramByZone(zone_id: number) {
    return  this.request.get( environment.backend + "subprogram4location?version="+environment.apiVersion+"&zone="+zone_id ).pipe(map(
      (subp: Subprogram[]) => {
        return subp;
      }
    ));
  }
  getCountryByLocation(latlng: number[]) {
    return  this.request.get( environment.backend + "country4Point?version="+environment.apiVersion+"&wkt=POINT("+latlng[1]+' '+latlng[0]+')' ).pipe(map(
      (country: string) => {
        return country;
      }
    ));
  }
  getZones4Boundaries(bounds: string) {
    return  this.request.get( environment.backend + "location4Polygon?version="+environment.apiVersion+"&wkt="+bounds ).pipe(map(
      (zones: L.GeoJSON) => {
        return zones;
      }
    ));
  }
  getNextZone(latlng: number[]) {
    return  this.request.get( environment.backend + "zone4point?version="+environment.apiVersion+"&wkt=POINT("+latlng[1]+' '+latlng[0]+')' ).pipe(map(
      (zones: L.GeoJSON) => {
        return zones;
      }
    ));
  }

  formatMarker(containers: Container[]): Container[] {
    for (let i = 0; i < containers.length; i++) {
      containers[i].class = this.materials[this.session.country][containers[i].main_material].class;
    }
    return containers;
  }
  //
    /***********************/
   /*       Search        */
  /***********************/
  //
  getResults(str: string){
    let params = this.params;
    params.set("q", str);
    params.set("locale", environment[this.session.country].locale);
    return  this.request.get(environment.backend + "search?version="+environment.apiVersion+"&locale=" + environment[this.session.country].locale + "&q="+str+"&dimensions="+this.session.searchDimensions.join(',') ).pipe(map(
      (result: any[]) => {
        if (result.length) {
          return result;
        }
        else {
          return [{name: 'No Results', class: 'none'}];
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
      class: this.materials[this.session.country][option.material_id].class,
      deposition: option.deposition,
    });
  });
  return res;
  }
  //Address search
  getAddressLocation(str: string) {
    return  this.request.get(environment.geocoder + "search?version="+environment.apiVersion+"&q="+str+','+this.session.country+'&countrycodes='+environment[this.session.country].code+'&format=json').pipe(map(
      (result: any[]) => {
        if (result.length) {
          return this.formatAddressOptions(result);
        }
        else {
          return [{name: 'No Results', class: 'none'}];
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
  getStatsTotals() {
    return  this.request.get(environment.backend + "stats/totals?version="+environment.apiVersion+"&country=" + environment[this.session.country].id ).pipe(map(
      (result: {title: string, total: number}[]) => {
        return result;
      }
    ));
  }
  getStatsPrograms() {
    return  this.request.get(environment.backend + "stats/programs?version="+environment.apiVersion+"&country=" + environment[this.session.country].id ).pipe(map(
      (result: {title: string, total: number}[]) => {
        return result;
      }
    ));
  }
}
