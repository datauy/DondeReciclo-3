import { Component } from '@angular/core';
import { Map, tileLayer, marker } from 'leaflet';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
})

export class LeafletComponent {
  map: Map;
  propertyList = [];

  constructor() { }

  ionViewDidEnter() {
    this.map = new Map('map').setView([42.35663, -71.1109], 16);

    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com'
    }).addTo(this.map);

    fetch('./assets/data.json').then(res => res.json())
    .then(json => {
      this.propertyList = json.properties;
      this.leafletMap();
    });
  }

  leafletMap() {
    for (const property of this.propertyList) {
      marker([property.lat, property.long]).addTo(this.map)
        .bindPopup(property.city)
        .openPopup();
    }
  }

  ionViewWillLeave() {
    this.map.remove();
  }
}