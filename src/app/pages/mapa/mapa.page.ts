import { Component, OnInit, ViewChild } from '@angular/core';

import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { Container, Program } from "src/app/models/basic_models.model";
import { CupertinoPane } from 'cupertino-pane';

import { ApiService } from "src/app/services/api.service";
import { MapService } from "src/app/services/map.service";
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';
//import { IonRouterOutlet } from '@ionic/angular';
//import { createAnimation } from '@ionic/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  address: string[];
  container = {} as Container;
  infoPane: CupertinoPane;
  programs_sum: Program[];
  uLocation = false as boolean;

  infoPaneEl: HTMLDivElement;

  constructor(
    private geocoder: NativeGeocoder,
    public api: ApiService,
    public map: MapService,
    public session: SessionService,
    private geo: Geolocation
    // private backbuttonSubscription: Subscription
  ) {
    this.session = session;
    this.map.pinClicked.subscribe(
      pinData => {
        console.log(pinData);
        if ( pinData ) {
          this.showPane();
        }
      }
    );
    this.map.mapChanged.subscribe(
      change => {
        if (change) {
          this.loadNearbyContainers(false);
        }
      }
    );
  }
  //
  ngOnInit() {
    // this.app = document.querySelector('app-search');
    this.api.loadProgramSummary().subscribe((programs) => {
      this.programs_sum = programs;
    });
    this.loadInfoPane();
  }
  //
  ionViewDidEnter() {
    if ( this.session.searchItem != undefined ) {
      this.session.showSearchItem = true;
    }
    if ( this.map.userPosition == undefined ) {
      this.gotoLocation();
    }
    else {
      this.uLocation = true;
      this.map.loadMap(this.map.userPosition);
      this.loadNearbyContainers(false);
      this.map.flytomarker(this.map.userPosition, 14);
    }
    //Wait 3 seconds for user location and start loading LOad nearbymap
    setTimeout( async () => {
      if ( !this.uLocation ) {
        this.map.loadMap();
        this.loadNearbyContainers(false);
        this.map.flytomarker([environment.ucenter[0],environment.ucenter[1]] , 14);
      }
    }, 3000);
  }
  //
  ionViewWillLeave() {
    this.session.showSearchItem = false;
  }

  // dragMapCupertino(){
  //   this.infoPaneEl = document.querySelector('.cupertino-pane > .pane');
  //   const paneHeight = this.infoPaneEl.getBoundingClientRect().top;
  //   this.mapEl.style.height = paneHeight.toString() + 'px';
  //   console.log(this.infoPaneEl.getBoundingClientRect().top);
  //   console.log(this.mapEl.clientHeight);
  // }
  //
  // breakPointMapCupertino(){
  //   console.log('wtf');
  //   const currentBreak = this.infoPane.currentBreak();
  //   console.log('break: ', currentBreak);
  //   switch (true) {
  //       case currentBreak == "middle":
  //         console.log('break: ', currentBreak);
  //         this.map.flytomarker(200);
  //       // case currentBreak == "bottom":
  //       //   this.map.recenter(400);
  //   }
  // }
  loadInfoPane() {
    var initPane = 'middle';
    var topBreak = window.innerHeight*.9;
    if ( window.innerWidth >= 560 ) {
      initPane = 'top';
      topBreak = window.innerHeight*.7;
    }
    this.infoPane = new CupertinoPane(
      '.cupertino-pane', // Pane container selector
      {
        parentElement: '.map-section', // Parent container
        // backdrop: true,
        bottomClose: true,
        //topperOverflow: true,
        showDraggable: true,
        simulateTouch: false,
        draggableOver: true,
        topperOverflowOffset: 200,
        initialBreak: initPane,
        breaks: {
          top: {
            enabled: true,
            offset: topBreak
          },
          middle: {
            enabled: true,
            offset: window.innerHeight*.7
          },
        },
        // onDidPresent: () => this.breakPointMapCupertino(),
        onWillPresent: () => this.cupertinoShow(),
        // onBackdropTap: () => this.infoPane.hide(),
        onWillDismiss: () => this.cupertinoHide(),
      }
    );
  }
  cupertinoShow(){
    this.session.showSearchItem = false;
    this.session.cupertinoState = 'cupertinoOpen';
    this.map.flyToBounds(
      [[this.map.currentContainer.latitude, this.map.currentContainer.longitude],
      this.map.userPosition],
      {paddingBottomRight: [0,400]}
    );
  }
  cupertinoHide(){
    this.session.showSearchItem = true;
    this.session.cupertinoState = 'cupertinoClosed';
    this.map.flyToBounds(this.map.currentBounds);
  }
  showPane() {
    this.api.getContainer(this.map.currentContainer.id).subscribe((container) => {
      this.formatContainer(container);
      this.infoPane.present({animate: true});
      console.log(this.container);
      if ( this.map.userPosition ) {
        if ( this.map.route != null ) {
          this.map.route.spliceWaypoints(1, 1, [this.container.latitude, this.container.longitude]);
        }
        else {
          this.map.drawRoute(this.map.userPosition, [this.container.latitude, this.container.longitude]);
        }
      }
    });
  }
  hidePane() {
    this.infoPane.destroy({animate: true});
  }
  //
  loadNearbyContainers(fly: boolean) {
    if ( this.session.searchItem != undefined){
      this.api.getContainers4Materials(this.map.getBoundingCoords(), this.session.searchItem.type+"="+this.session.searchItem.id).subscribe((containers) => {
        this.map.loadMarkers(containers, fly);
      });
    }
    else {
      this.api.getContainers(this.map.getBoundingCoords()).subscribe((containers) => {
        this.map.loadMarkers(containers, fly);
      });
    }
  }
  //
  gotoLocation() {
    this.geo.getCurrentPosition().then( (resp) => {
      this.uLocation = true;
      this.map.userPosition = [resp.coords.latitude, resp.coords.longitude];
      //this.map.loadMap([resp.coords.latitude, resp.coords.longitude]);
      //this.loadNearbyContainers(false);
      this.api.getNearbyContainers(5, [resp.coords.latitude, resp.coords.longitude]).subscribe(
        (containers) => {
          this.map.loadMarkers(containers, false);
        }
      );
      this.map.flytomarker(this.map.userPosition, 15);
    }).catch((error) => {
      console.log('Error getting location', error);
      this.map.loadMap();
      this.loadNearbyContainers(true);
      //this.map.flytomarker([environment.ucenter[0],environment.ucenter[1]] , 14);
    });
  }
  //
  formatContainer(container: Container) {
    container.type_icon = this.api.container_types[container.type_id].icon;
    container.program_icon = this.programs_sum[container.program_id].icon;
    container.program = this.programs_sum[container.program_id].name;
    this.container = container;
    if ( container.materials.length == 0 ) {
      this.api.getWastes(container.wastes).subscribe((wastes) => {
        this.container.receives = wastes;
      });
    }
    else {
      this.container.receives = this.api.getMaterials(container.materials);
    }
  }
  geolocate() {
    console.log('GEOLOCATION');
    this.gotoLocation();
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
}
