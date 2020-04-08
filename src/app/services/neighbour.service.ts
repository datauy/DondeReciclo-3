import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Neighbour } from '../models/neighbour.model';

import { Map, tileLayer, marker, Routing, control} from "leaflet";
import "leaflet";
declare let L;

@Injectable({
  providedIn: 'root'
})
export class NeighbourService {
  neighbours: [];
  neighbour: Neighbour;

  setNeighbours(data) {
    this.neighbours = data;
  }

  getNeighbours() {
    return this.neighbours;
  }

  setNeighbour(data) {
    this.neighbour = data;
  }

  getNeighbour() {
    return this.neighbour;
  }

  neighboursData: string = '../../assets/neighbours.geojson';

  // neighbours_raw: string = ''
  constructor(private http: HttpClient) {

    // fetch(this.neighbour).then(res => res.json())
    //   .then(data => {
    //     this.neighboursData = data;
    //   });
  }
  makeNeighbourMarkers(map: L.Map): void {
    this.http.get(this.neighboursData).subscribe((res: any) => {
      // for (const c of neighboursData.features) {
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
