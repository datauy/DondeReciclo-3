import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Container } from "src/app/models/basic_models.model";

import "leaflet";
import "leaflet-routing-machine";

declare let L;

const iconUrl = 'assets/custom-icons/dr-pin.svg';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [29, 37],
  iconAnchor: [12, 37],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
const iconUser = L.icon({
  iconUrl: 'assets/custom-icons/dr-user-gps.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = iconDefault;

@Injectable({
  providedIn: 'root'
})

export class MapService {
  map: L.Map;
  route: any;
  userPosition: [number, number];
  userMarker: L.Marker;
  currentContainer: Container;
  containers: Container[];

  constructor() {
  }

  loadMap() {
    this.map = new L.Map("map", {});//.setView([-34.881536, -56.147968], 13);
    this.map.locate({
      setView: true,
      maxZoom: 16
    }).
    on('locationfound', (e :any) => {
      this.userPosition = [e.latitude, e.longitude];
      let markerGroup = L.featureGroup();
      let marker: any = L.marker( this.userPosition, {icon: iconUser} ).
      on('click', () => {
        alert('Marker clicked');
      });
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
    }).
    on('locationerror', (err) => {
      console.log(err.message);
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(this.map);
    //Create user marker upon click
    this.map.on("click", <LeafletMouseEvent>(e) => {
      if (this.userMarker) { // check
        this.map.removeLayer(this.userMarker); // remove
      }
      this.userPosition = [e.latlng.lat, e.latlng.lng];
      this.userMarker = L.marker(this.userPosition, {icon: iconUser} ).addTo(this.map); // add the marker onclick
      if (this.route) {
        this.route.spliceWaypoints(0, 1, e.latlng);
      }
    });
  }

  loadMarkers( markers: Container[], center?:[number,number] ){
    this.containers = markers;
    let mapBounds = [];
    if (this.userPosition) {
      mapBounds.push(this.userPosition);
    }
    console.log(markers);
    for (var i = 0; i < markers.length; i++) {
      new L.marker([markers[i].latitude,markers[i].longitude], {container_pos: i})
      .on('click', this.clickPin, this) //L.bind(this.showPane, null, markers[i]))
      .addTo(this.map);
      mapBounds.push([markers[i].latitude, markers[i].longitude]);
    }
    if (markers.length > 0){
      this.map.fitBounds(mapBounds);
      return 1;
    }else{
      return 0;
    }
  }

  locatePosition() {
    this.map.locate({ setView: true }).on("locationfound", (e: any) => {
      if (this.userMarker) { // check
        this.map.removeLayer(this.userMarker); // remove
      }
      this.userMarker = L.marker([e.latitude, e.longitude], {
        draggable: true
      }).addTo(this.map);
      this.userMarker.bindPopup('Elegir esta ubicación').openPopup();
      //this.getAddress(e.latitude, e.longitude);
      console.log(e.latitude, e.longitude);
      this.userMarker.on("dragend", () => {
        let userPos = this.userMarker.getLatLng();
        this.userPosition = [ userPos[0], userPos[1] ] ;
        //this.getAddress(position.lat, position.lng);
        //console.log(position.lat, position.lng);
      });
    });
  }
  drawRoute( start:[number, number], end:[number, number]) {
    return this.route = L.Routing.control({
      waypoints: [L.latLng(start), L.latLng(end)],
      createMarker: function(i: number, dStart: L.LatLng, n: number){ return null },
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints : false,
      Instruction: 'text',
      show: false, //for hidding routing itinerary
      router: L.Routing.mapbox('pk.eyJ1IjoiYm90dW0iLCJhIjoiY2s4anBoOHRzMGJ5dzNscDg1c2drMXBoNSJ9.vQ7qAGX7IMadmIfcCp7eRQ')
    }).addTo(this.map);
	}
  clickPin(pin: any) {
    console.log("Executed by Service aaaahhhhhhhhh");
    let pos = pin.target.options.container_pos;
    this.currentContainer = this.containers[pos];
    this._pinClick.next(true);
  }
  //Experimental Observable
  get pinClicked() {
    return this._pinClick.asObservable();
  }
  private _pinClick = new BehaviorSubject<boolean>(false)
}
