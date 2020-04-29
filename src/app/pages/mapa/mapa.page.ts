import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { Router, NavigationExtras } from "@angular/router";

// import { Map, tileLayer, marker, Routing, control} from "leaflet";
import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";

// import { NeighbourService } from 'src/app/services/neighbour.service';

// API
import { Subprogram } from "../../models/subprogram.model";
import { SubprogramService } from "../../services/subprogram.service";


import { CupertinoPane } from 'cupertino-pane';

import "leaflet";
import "leaflet-routing-machine";

import { ModalCompartirPage } from '../modal-compartir/modal-compartir.page';
import { ModalSearchPage } from '../modal-search/modal-search.page';
import { fromEvent, Subscription } from 'rxjs';


declare let L;

const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
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
  
  map: L.Map;
  newMarker: any;
  userMarker: any;
  container: any;
  newRute: any;
  address: string[];
  subprogram = {} as Subprogram;
  subprograms: Subprogram[];
  dataReturned:any;
  panelData: any;
  infoPanel: any;  

  constructor(
    private geocoder: NativeGeocoder, 
    private router: Router,
    public modalController: ModalController,
    private subprogramsService: SubprogramService,
    // private backbuttonSubscription: Subscription
    ) {
  }

  ionViewDidEnter() {
    this.loadMap();
    this.loadSubprograms();
  }

  // SocialModal

  ngOnInit() {
    // this.loadingModal();
    console.log(this.panelData);
    this.infoPanel = new CupertinoPane(
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
            offset: 300
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

  showPane() {
    // this.panelData = containerID;
    this.infoPanel.present({
      animate: true,
    });

  }
  
  async loadingModal() {
    const modal = await this.modalController.create({
      component: ModalCompartirPage,
      componentProps: {
        "modalBody": "Loading..."
      },
      cssClass: 'modal-fullscreen'
    });
    // const event = fromEvent(document, 'backbutton');
    // this.backbuttonSubscription = event.subscribe(async () => {
    //     const modal = await this.modalController.getTop();
    //     if (modal) {
    //         modal.dismiss();
    //     }
    // });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        // this.backbuttonSubscription.unsubscribe();
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }
  async openSocialModal() {
    const modal = await this.modalController.create({
      component: ModalCompartirPage,
      componentProps: {
        "modalBody": "https://data.org.uy"
      },
      cssClass: 'custom-modal'
    });
    // const event = fromEvent(document, 'backbutton');
    // this.backbuttonSubscription = event.subscribe(async () => {
    //     const modal = await this.modalController.getTop();
    //     if (modal) {
    //         modal.dismiss();
    //     }
    // });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        // this.backbuttonSubscription.unsubscribe();
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }


  async openSearchModal() {
    // console.log('click')
    const modal = await this.modalController.create({
      component: ModalSearchPage,
      componentProps: {
        "modalBody": "https://data.org.uy"
      },
      cssClass: 'search-modal'
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }

  goSearch(){
    this.router.navigateByUrl('/buscar');
  }

  // API

  loadSubprograms() {
    this.subprogramsService.get().subscribe((subprograms: Subprogram[]) => {
      this.subprograms = subprograms;
      let mapBounds = []
      for (var i = 0; i < subprograms.length; i++) {
        console.log(subprograms);
        this.newMarker = new L.marker([subprograms[i].lat,subprograms[i].long])
        .bindPopup(subprograms[i].subprogram)
        .addTo(this.map);
        mapBounds.push([subprograms[i].lat,subprograms[i].long]);
      }
      this.map.fitBounds(mapBounds);
    });
  }  

  // Map

  loadMap() {
    this.map = new L.Map("map", {
    }).setView([-34.881536, -56.147968], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(this.map);
    

    this.map.on("click", <LeafletMouseEvent>(e) => {
      if (this.userMarker) { // check
        this.map.removeLayer(this.userMarker); // remove
    } 
    this.userMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map); // add the marker onclick
    this.panelData = e.latlng;
    this.showPane(); // show the bottom info panel  
    });
  }

  
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

  drawRute(lat: number, long: number) {
    this.newRute = L.Routing.control({ 
      waypoints: [L.latLng(lat, long), L.latLng(-34.79688926182469, -56.07833862304688)],
      routeWhileDragging: true,
      router: L.Routing.mapbox('pk.eyJ1IjoiYm90dW0iLCJhIjoiY2s4anBoOHRzMGJ5dzNscDg1c2drMXBoNSJ9.vQ7qAGX7IMadmIfcCp7eRQ')
    }).addTo(this.map);
    
	}
}
