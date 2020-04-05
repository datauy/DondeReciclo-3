import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Map, tileLayer, marker, Routing, control} from "leaflet";
import "leaflet";
declare let L;

@Injectable({
  providedIn: 'root'
})
export class BarriosService {

  barrios: string = '../../assets/barrios.geojson';

  // barrios_raw: string = ''
  constructor(private http: HttpClient) {

    // fetch(this.barrios).then(res => res.json())
    //   .then(data => {
    //     this.barriosData = data;
    //   });
  }
  makeBarriosMarkers(map: L.Map): void {
    this.http.get(this.barrios).subscribe((res: any) => {
      // for (const c of barriosData.features) {
      //   const lat = c.geometry.coordinates[0];
      //   const lon = c.geometry.coordinates[1];
      //   const marker = L.marker([lon, lat]).addTo(map);
      //   console.log(c);
      // }
      L.geoJSON(res.features, {
        filter: function(feature, layer) {
            console.log("loop");
            L.geoJSON(feature).addTo(map);
        }
      });
    });
  }
}
