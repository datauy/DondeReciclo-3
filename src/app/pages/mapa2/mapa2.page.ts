import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";

import { Map, latLng, tileLayer, Icon, icon, marker } from "leaflet";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";


// import "leaflet";
// import "leaflet-routing-machine";
// declare let L;

@Component({
  selector: 'app-mapa2',
  templateUrl: './mapa2.page.html',
  styleUrls: ['./mapa2.page.scss'],
})
export class Mapa2Page implements OnInit {
  
  map: Map;

  constructor(
    ) {}

  // Geolocation to get current possition

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.map = new Map("map").setView([-34.2187193,-54.7609442], 13);

    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(this.map);
  }

  // locatePosition() {
  //   this.map.locate({ setView: true }).on("locationfound", (e: any) => {
  //     this.newMarker = marker([e.latitude, e.longitude], {
  //       draggable: true
  //     }).addTo(this.map);
  //     this.newMarker.bindPopup("You are located here!").openPopup();
  //     this.getAddress(e.latitude, e.longitude);
  //     // this.pickupLat = e.latitude;
  //     // this.pickupLong = e.longitude;
  //     this.newMarker.on("dragend", () => {
  //       const position = this.newMarker.getLatLng();
  //       this.getAddress(position.lat, position.lng);
  //       // this.pickupLat = position.lat;
  //       // this.pickupLong = position.lng;
  //     });
  //   });
  // }

  // getAddress(lat: number, long: number) {
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };
  //   this.geocoder.reverseGeocode(lat, long, options).then(results => {
  //     this.address = Object.values(results[0]).reverse();
  //     console.log(this.address);
  //   });
  // }


  // options = {
  //   layers: [
  //     tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //       attribution: "© OpenStreetMap contributors"
  //     })
  //   ],
  //   zoom: 13,
  //   center: latLng(46.879966, -121.726909)
  // };

  // Override default Icons
  // private defaultIcon: Icon = icon({
  //   iconUrl: "assets/marker-icon.png",
  //   shadowUrl: "assets/marker-shadow.png"
  // });

  // onMapReady(map: L.Map) {

  //   L.Routing.control({
  //     waypoints: [
  //         L.latLng(57.74, 11.94),
  //         L.latLng(57.6792, 11.949)
  //     ],
  //     routeWhileDragging: true
  //   }).addTo(map);
    // L.Routing.control({
    //   router: L.Routing.osrmv1({
    //       serviceUrl: `http://router.project-osrm.org/route/v1/`
    //   }),
    //   showAlternatives: true,
    //   lineOptions: {styles: [{color: '#242c81', weight: 7}]},
    //   fitSelectedRoutes: false,
    //   altLineOptions: {styles: [{color: '#ed6852', weight: 7}]},
    //   show: false,
    //   routeWhileDragging: true,
    //   waypoints: [
    //       L.latLng(57.74, 11.94),
    //       L.latLng(57.6792, 11.949)
    //   ]
    // }).addTo(map);
  // }

}
