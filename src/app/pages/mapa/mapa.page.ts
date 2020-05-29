import { Component, OnInit } from '@angular/core';

import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";

import { Container } from "src/app/models/container.model";
import { CupertinoPane } from 'cupertino-pane';

import { ApiService } from "src/app/services/api.service";
import { MapService } from "src/app/services/map.service";
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  // @ViewChild("infoPane", {
  //   read: ElementRef
  // }) private infoPane: ElementRef;
  address: string[];
  container = {} as Container;
  infoPane: CupertinoPane;

  constructor(
    private geocoder: NativeGeocoder,
    public api: ApiService,
    public map: MapService,
    public session: SessionService
    // private backbuttonSubscription: Subscription
    ) {
      this.map.pinClicked.subscribe(
        pinData => {
          console.log(pinData);
          if ( pinData ) {
            this.showPane();
          }
        }
      );
    }

  ionViewWillEnter(){
    this.session.breakPoint = "header-full";
  }

  ionViewDidEnter() {
    console.log("ENTER IN VIEW");
  }

  ngOnInit() {
    this.map.loadMap();
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
        showDraggable: true,
        simulateTouch: true,
        breaks: {
          middle: {
            enabled: true,
            offset: 500
          },
          bottom: {
            enabled: true,
            offset: 40
          }
        },
        onDrag: () => console.log('Drag event'),
        // onDidPresent: () => ;
        // onBackdropTap: () => this.infoPanel.hide(),
      }
    );
  }
  showPane() {
    this.container = this.map.currentContainer;
    //console.log(this.container);
    if ( this.map.userPosition ) {
      if ( this.map.route != null ) {
        console.log('Changing route');
        this.map.route.spliceWaypoints(1, 1, [this.container.latitude, this.container.longitude]);
      }
      else {
        console.log("Drawing route");
        this.map.drawRoute(this.map.userPosition, [this.container.latitude, this.container.longitude]);
      }
    }
    this.infoPane.present({animate: true});
  }

  loadNearbyContainers() {
    this.api.getNearbyContainers().subscribe((containers) => {
      this.map.loadMarkers(containers);
    });
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
