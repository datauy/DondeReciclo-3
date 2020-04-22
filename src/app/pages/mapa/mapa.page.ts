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

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
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
  newRute: any;
  address: string[];
  subprogram = {} as Subprogram;
  subprograms: Subprogram[];
  dataReturned:any;



  
  
  constructor(
    private geocoder: NativeGeocoder, 
    private router: Router,
    public modalController: ModalController,
    private subprogramsService: SubprogramService,
    // private backbuttonSubscription: Subscription
    ) {
  }

  dataReturned:any;

  ionViewDidEnter() {
    this.loadMap();
    this.loadSubprograms();
  }

  // SocialModal

  ngOnInit() {
    var myPane = new CupertinoPane(
      '.cupertino-pane', // Pane container selector
      { 
        parentElement: 'body', // Parent container
        breaks: {
            middle: { enabled: true, offset: 300 },
            bottom: { enabled: true, offset: 80 },
        },
        onDrag: () => console.log('Drag event')
      }
    );
    myPane.present({animate: true});
  }
  async openSocialModal() {
    console.log('click')
    const modal = await this.modalController.create({
      component: ModalCompartirPage,
      componentProps: {
        "paramURL": "https://data.org.uy"
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
    console.log('click')
    const modal = await this.modalController.create({
      component: ModalSearchPage,
      componentProps: {
        "paramURL": "https://data.org.uy"
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
      for (var i = 0; i < subprograms.length; i++) {
        console.log(subprograms);
        this.newMarker = new L.marker([subprograms[i].lat,subprograms[i].long])
        .bindPopup(subprograms[i].subprogram)
        .addTo(this.map);
      }
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
      console.log(e.latlng); // get the coordinates
      if (this.newMarker) { // check
        this.map.removeLayer(this.newMarker); // remove
    } this.newMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map); // add the marker onclick
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
