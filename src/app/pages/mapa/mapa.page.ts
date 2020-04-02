import { Component, OnInit } from '@angular/core';
// import { Map, latLng, tileLayer, Layer, marker, Icon, Marker } from 'leaflet';
import { latLng, tileLayer, Icon, icon, Marker } from "leaflet";

// declare var L:any;
// import 'leaflet';
// import 'leaflet-routing-machine';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})

export class MapaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

	// options = {
	// 	layers: [
	// 		tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	// 			attribution: "© OpenStreetMap contributors"
	// 		})
	// 	],
	// 	zoom: 1,
	// 	center: latLng(46.879966, -121.726909)
	// };

	// // Override default Icons
	// private defaultIcon: Icon = icon({
	// 	iconUrl: "assets/marker-icon.png",
	// 	shadowUrl: "assets/marker-shadow.png"
	// });

	// ngOnInit() {
	// 	Marker.prototype.options.icon = this.defaultIcon;
	// }

	// onMapReady(map: L.Map) {
	// 	L.Routing.control({
	// 		waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
	// 		routeWhileDragging: true
	// 	}).addTo(map);
  // }
  

// export class MapaPage implements OnInit {
//   map: Map;
//   propertyList = [];

//   constructor() { }

//   ionViewDidEnter() {
//     this.map = new Map('map').setView([42.35663, -71.1109], 16);

//     tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//       attribution: 'edupala.com'
//     }).addTo(this.map);

//     fetch('./assets/data.json').then(res => res.json())
//     .then(json => {
//       this.propertyList = json.properties;
//       this.leafletMap();
//     });
//   }

//   leafletMap() {
//     for (const property of this.propertyList) {
//       marker([property.lat, property.long]).addTo(this.map)
//         .bindPopup(property.city)
//         .openPopup();
//     }
//   }

//   ionViewWillLeave() {
//     this.map.remove();
//   }

//   // function createButton(label, container) {
//   //   var btn = L.DomUtil.create('button', '', container);
//   //   btn.setAttribute('type', 'button');
//   //   btn.innerHTML = label;
//   //   return btn;
//   // }

//   // this.map.on('click', function(e) {
//   //     var container = L.DomUtil.create('div'),
//   //         startBtn = createButton('Start from this location', container),
//   //         destBtn = createButton('Go to this location', container);

//   //     L.popup()
//   //         .setContent(container)
//   //         .setLatLng(e.latlng)
//   //         .openOn(this.map);
//   // });

// }
