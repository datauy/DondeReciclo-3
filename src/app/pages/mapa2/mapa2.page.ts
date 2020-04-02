import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, Icon, icon, Marker } from "leaflet";


import "leaflet";
import "leaflet-routing-machine";
declare let L;

@Component({
  selector: 'app-mapa2',
  templateUrl: './mapa2.page.html',
  styleUrls: ['./mapa2.page.scss'],
})
export class Mapa2Page {
  
  options = {
    layers: [
      tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      })
    ],
    zoom: 13,
    center: latLng(46.879966, -121.726909)
  };

  // Override default Icons
  private defaultIcon: Icon = icon({
    iconUrl: "assets/marker-icon.png",
    shadowUrl: "assets/marker-shadow.png"
  });

  ngOnInit() {
    Marker.prototype.options.icon = this.defaultIcon;
  }

  onMapReady(map: L.Map) {
    
    L.Routing.control({
      router: L.Routing.osrmv1({
          serviceUrl: `http://router.project-osrm.org/route/v1/`
      }),
      showAlternatives: true,
      lineOptions: {styles: [{color: '#242c81', weight: 7}]},
      fitSelectedRoutes: false,
      altLineOptions: {styles: [{color: '#ed6852', weight: 7}]},
      show: false,
      routeWhileDragging: true,
      waypoints: [
          L.latLng(57.74, 11.94),
          L.latLng(57.6792, 11.949)
      ]
    }).addTo(map);
  }

}
