import { Component, OnInit } from '@angular/core';

import { Router, NavigationExtras } from "@angular/router";

import { Map, tileLayer, marker, Routing, control} from "leaflet";
import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";


import "leaflet";
import "leaflet-routing-machine";
declare let L;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage {
  
  map: Map;
  newMarker: any;
  newRute: any;
  address: string[];

  constructor(private geocoder: NativeGeocoder, private router: Router) {}


  // Routing.control({
  //   //   waypoints: [null],
  //   waypoints: [
  //       L.latLng(44.91221, 7.671685),
  //       L.latLng(44.907852, 7.673789)
  //   ],
  //   routeWhileDragging: true,
  //   show: true,
  //   language: 'it',
  //   geocoder: L.Control.Geocoder.nominatim(),
  //   autoRoute: true
  //   }).addTo(map);

  createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
  };

  // this.map.on('click', function(e) {
  //     var container = L.DomUtil.create('div'),
  //         startBtn = createButton('Start from this location', container),
  //         destBtn = createButton('Go to this location', container);

  //     L.popup()
  //         .setContent(container)
  //         .setLatLng(e.latlng)
  //         .openOn(map);
  // });

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    this.map = new Map("map", {
      // maxZoom: 20,
      // minZoom: 6,
      zoomControl: false
  }).setView([-34.881536, -56.147968], 13);
  
  control.zoom({
      position: 'bottomright'
  }).addTo(this.map);

    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(this.map);
  }

  locatePosition() {
    this.map.locate({ setView: true }).on("locationfound", (e: any) => {
      this.newMarker = marker([e.latitude, e.longitude], {
        draggable: true
      }).addTo(this.map);
      this.newMarker.bindPopup('Elegir esta ubicación').openPopup();
      this.getAddress(e.latitude, e.longitude);
      console.log(e.latitude, e.longitude);
      // this.pickupLat = e.latitude;
      // this.pickupLong = e.longitude;
      this.newMarker.on("dragend", () => {
        const position = this.newMarker.getLatLng();
        this.getAddress(position.lat, position.lng);
        console.log(position.lat, position.lng);
        // this.pickupLat = position.lat;
        // this.pickupLong = position.lng;
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
    this.drawRute(lat, long);
  }

  confirmPickupLocation() {
    let navigationextras: NavigationExtras = {
      state: {
        pickupLocation: this.address
      }
    };
    this.router.navigate(["home"], navigationextras);
  }

  drawRute(lat: number, long: number) {
    this.newRute = Routing.control({ 
      waypoints: [L.latLng(lat, long), L.latLng(-34.24359472969739, -54.68994140625001)],
      routeWhileDragging: true,
      router: L.Routing.mapbox('pk.eyJ1IjoiYm90dW0iLCJhIjoiY2s4anBoOHRzMGJ5dzNscDg1c2drMXBoNSJ9.vQ7qAGX7IMadmIfcCp7eRQ')
    }).addTo(this.map);
    
	}
}
