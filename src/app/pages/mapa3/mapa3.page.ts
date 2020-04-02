import { Component, OnInit } from '@angular/core';

import { Router, NavigationExtras } from "@angular/router";

import { Map, tileLayer, marker } from "leaflet";
import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";

@Component({
  selector: 'app-mapa3',
  templateUrl: './mapa3.page.html',
  styleUrls: ['./mapa3.page.scss'],
})
export class Mapa3Page {
  map: Map;
  newMarker: any;
  address: string[];

  constructor(private geocoder: NativeGeocoder, private router: Router) {}

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    this.map = new Map("map").setView([17.385, 78.4867], 13);

    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(this.map);
  }

  locatePosition() {
    this.map.locate({ setView: true }).on("locationfound", (e: any) => {
      this.newMarker = marker([e.latitude, e.longitude], {
        draggable: true
      }).addTo(this.map);
      this.newMarker.bindPopup("Estas aquí!").openPopup();
      this.getAddress(e.latitude, e.longitude);
      this.pickupLat = e.latitude;
      this.pickupLong = e.longitude;
      this.newMarker.on("dragend", () => {
        const position = this.newMarker.getLatLng();
        this.getAddress(position.lat, position.lng);
        this.pickupLat = position.lat;
        this.pickupLong = position.lng;
      });
    });
  }

  getAddress(lat: number, long: number) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.geocoder.reverseGeocode(lat, long, options).then(results => {
      this.address = Object.values(results[0]).reverse();
      console.log(this.address);
    });
  }

  confirmPickupLocation() {
    let navigationextras: NavigationExtras = {
      state: {
        pickupLocation: this.address
      }
    };
    this.router.navigate(["home"], navigationextras);
  }

  goBack() {
    this.router.navigate(["home"]);
  }
}
