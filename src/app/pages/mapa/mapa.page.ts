import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";

import { Container } from "../../models/container.model";
import { ContainerType } from "../../models/container_types.model";
import { ApiService } from "../../services/api.service";
import { CupertinoPane } from 'cupertino-pane';


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

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  // @ViewChild("infoPane", {
  //   read: ElementRef
  // }) private infoPane: ElementRef;

  map: L.Map;
  newMarker: any;
  userMarker: any;
  userPosition: [number, number]
  newRute: any;
  address: string[];
  container = {} as Container;
  containers: Container[];
  containerType = {} as ContainerType
  containerTypes: ContainerType[];
  dataReturned:any;
  panelData: any;
  infoPane: CupertinoPane;

  constructor(
    private geocoder: NativeGeocoder,
    public modalController: ModalController,
    public api: ApiService<any>,
    // private backbuttonSubscription: Subscription
    ) {
  }

  ionViewDidEnter() {
    console.log("ENTER IN VIEW");
  }

  ngOnInit() {
    this.loadMap();
    this.loadNearbyContainers();
    // this.openSearchModal();
    this.loadInfoPane();

  }

  loadInfoPane() {
    this.infoPane = new CupertinoPane(
      '.cupertino-pane', // Pane container selector
      {
        parentElement: 'body', // Parent container
        // backdrop: true,
        bottomClose: true,
        buttonClose: false,
        topperOverflow: true,
        showDraggable: false,
        simulateTouch: true,
        breaks: {
          middle: {
            enabled: true,
            offset: 500
          },
          bottom: {
            enabled: true,
            offset: 60
          }
        },
        onDrag: () => console.log('Drag event'),
        // onDidPresent: () => ;
        // onBackdropTap: () => this.infoPanel.hide(),
      }
    );
  }
  showPane(pin: any) {
    let pos = pin.target.options.container_pos;
    console.log("SHOWING PANE");
    //console.log(e);
    this.container = this.containers[pos];
    console.log(this.container);
    this.drawRute();
    this.infoPane.present({animate: true});
  }

  loadNearbyContainers() {
    this.api.getNearbyContainers().subscribe((containers) => {
      this.containers = containers;
      let mapBounds = [this.userMarker]
      console.log(containers);
      for (var i = 0; i < containers.length; i++) {
        this.newMarker = new L.marker([containers[i].latitude,containers[i].longitude], {container_pos: i})
        .on('click', this.showPane, this) //L.bind(this.showPane, null, containers[i]))
        .addTo(this.map);
        mapBounds.push([containers[i].latitude,containers[i].longitude]);
      }
      this.map.fitBounds(mapBounds);
    });
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
    });
  }

  onMapReady() {
    setTimeout(() => {
      this.map.invalidateSize();
      console.log('map ready')
    }, 0);
  }

//Create additional Control placeholders, to group all control buttons
/*addControlPlaceholders(map) {
 const corners = map._controlCorners;
 const l = 'leaflet-';
 const toolsPanel = map._controlContainer;
 function createCorner(vSide, hSide) {
     const className = l + vSide + ' ' + l + hSide;
     corners[vSide + hSide] = L.DomUtil.create('div', className, toolsPanel);
 }
 createCorner('verticalcenter', 'left');
}*/

  locatePosition() {
    this.map.locate({ setView: true }).on("locationfound", (e: any) => {
      if (this.newMarker) { // check
        this.map.removeLayer(this.newMarker); // remove
      }
      this.newMarker = L.marker([e.latitude, e.longitude], {
        draggable: true
      }).addTo(this.map);
      this.newMarker.bindPopup('Elegir esta ubicación').openPopup();
      this.getAddress(e.latitude, e.longitude);
      console.log(e.latitude, e.longitude);
      this.newMarker.on("dragend", () => {
        const position = this.newMarker.getLatLng();
        this.getAddress(position.lat, position.lng);
        console.log(position.lat, position.lng);
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
    this.drawRute();
  }

  drawRute() {
    this.newRute = L.Routing.control({
      waypoints: [L.latLng(this.userPosition), L.latLng(this.container.latitude, this.container.longitude)],
      routeWhileDragging: true,
      router: L.Routing.mapbox('pk.eyJ1IjoiYm90dW0iLCJhIjoiY2s4anBoOHRzMGJ5dzNscDg1c2drMXBoNSJ9.vQ7qAGX7IMadmIfcCp7eRQ')
    }).addTo(this.map);

	}
}
