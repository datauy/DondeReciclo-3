import { Component, OnInit } from '@angular/core';
import { Event, Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { Container, Program, Weekdays } from "src/app/models/basic_models.model";
import { CupertinoPane } from 'cupertino-pane';

import { ApiService } from "src/app/services/api.service";
import { MapService } from "src/app/services/map.service";
import { SessionService } from 'src/app/services/session.service';
//import { IonRouterOutlet } from '@ionic/angular';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Subprogram } from "src/app/models/subprogram.model";

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
  uLocation = false;
  subprograms: Subprogram[];
  subprogram: Subprogram;

  infoPaneEl: HTMLDivElement;
  loadingImg = false;
  fileType: any = {
    name: 'Subir otra foto',
    class: 'camera'
  };
  weekday = new Weekdays;
  showSched = false;
  //Displays: 0:Es contenedor, 1:Es Lista (subprogramas), 2:Es subprograma
  list = 0;
  //Estados: 0:Cerrado-Inactivo, 1:Abierto, 2:Cerrado-Activado, 3:Cerrado-Mostrando? O debiera ser abierto??
  zoneVisible = 0;
  //Load data over recommended zoom
  eagerLoad = false;
  loadContainer = 0;
  currentUrl = '/intro/mapa';

  constructor(
    private geocoder: NativeGeocoder,
    private router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
    public utils: UtilsService,
    public map: MapService,
    public session: SessionService,
    private geo: Geolocation,
    private authGuard: AuthGuardService,
    private notification: NotificationsService,
    // private backbuttonSubscription: Subscription
  ) {
    this.session = session;
    this.map.pinClicked.subscribe(
      pinData => {
        if ( pinData ) {
          this.list = 0;
          this.showPane();
        }
      }
    );
    this.map.zoneClicked.subscribe(
      data => {
        if ( data && this.zoneVisible == 3) {
          this.subprograms4location();
        }
      }
    );
    this.map.mapChanged.subscribe(
      change => {
        if (change) {
          if ( this.map.zoom >= 14 || this.eagerLoad ) {
            this.notification.closeNotificationId('zoom');
            this.loadNearbyContainers(false);
            if ( this.zoneVisible == 3 ) {
              this.zoneVisible = 2;
              this.getZones();
            }
          }
          else {
            let noZoom = {
              id: 'zoom',
              type: 'notification',
              class: 'alert',
              title: 'No estamos cargando datos, acércate al mapa',
              note: 'Debido al nivel de zoom y para proteger el funcionamiento de la aplicación y el dispositivo hemos desactivado la carga automática de datos mientras navega.',
              link: this.currentUrl,
              link_title: 'Cargar de todas formas',
              link_params: {'eagerLoad': 1}
              //link_fragment: "load-data"
            };
            this.notification.showNotification(noZoom);
          }
        }
      }
    );
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd ) {
        this.mapaRouter(event);
      }
    });
  }
  //
  ngOnInit() {
      // this.app = document.querySelector('app-search');
    this.currentUrl = this.router.url.split('?')[0];
    this.programs_sum = this.api.programs;
    this.loadInfoPane();
  }
  //
  ionViewDidEnter() {
    //Carga mapa con centro en LA
    this.map.loadMap();
    if ( this.loadContainer > 0) {
      this.api.loadProgramSummary().subscribe(
        (programs_sum) => {
          this.programs_sum = programs_sum;
          console.log("going to show pane", programs_sum);
            this.showPane();
        }
      )
    }
    else {
      if ( this.map.userPosition == undefined ) {
        this.gotoLocation();
      }
      else {
        this.uLocation = true;
        this.api.getNearbyContainers(2, this.map.userPosition).subscribe(
          (containers) => {
            this.map.loadMarkers(containers, true);
          }
        );
        //this.map.flytomarker(this.map.userPosition, 15);
      }
      if ( this.session.country != undefined ) {
        //El resize hace un fly al centro del mapa
        this.map.resizeMap(0);
        if ( this.session.searchItem != undefined ) {
          this.session.showSearchItem = true;
        }
        //Wait 3 seconds for user location and start loading LOad nearbymap
        setTimeout( () => {
          if ( !this.uLocation ) {
            this.api.getNearbyContainers(0.5, [this.map.center.lat, this.map.center.lng]).subscribe(
              (containers) => {
                this.map.loadMarkers(containers, true);
              }
            );
          }
        }, 4000);
      }
    }
  }
  //
  ionViewWillLeave() {
    this.session.showSearchItem = false;
  }
  mapaRouter(event?: any) {
    if ( event != undefined ) {
      var url_arr = event.url.split('?');
      if ( 1 in url_arr ) {
        if ( url_arr[1].startsWith('zones') ) {
          this.activateZone();
        }
        if ( url_arr[1].startsWith('eagerLoad') ) {
          this.eagerLoad = true;
          //Set eager load for 10 secs
          setTimeout( () => {
            this.eagerLoad = false;
          }, 10000);
        }
        this.router.navigate([this.currentUrl]);
      }
    }
    let params = this.route.snapshot.queryParams;
    if ( params.hasOwnProperty('zones') && params.zones == 1 ) {
      this.activateZone();
    }
    /*No allow eager in Load
    if ( params.hasOwnProperty('eagerLoad') && params.eagerLoad == 1 ) {
      console.log('EAGER');
      this.eagerLoad = true;
    }*/
    if ( this.route.snapshot.params['containerID'] != undefined && this.route.snapshot.params['containerID'] > 0 ) {
      this.loadContainer = this.route.snapshot.params['containerID'];
    }
  }
  // dragMapCupertino(){  m
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
  //
  loadInfoPane() {
    var initPane: ('top' | 'middle' | 'bottom');
    initPane = 'middle';
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
  //
  cupertinoShow(){
    this.session.showSearchItem = false;
    this.session.cupertinoState = 'cupertinoOpen';
    if (this.map.currentContainer != undefined) {
      this.map.flyToBounds(
        [[this.map.currentContainer.latitude, this.map.currentContainer.longitude],
        this.map.userPosition],
        {paddingBottomRight: [0,400]}
      );
    }
  }
  //
  cupertinoHide(){
    this.list = 0;
    this.session.showSearchItem = true;
    this.session.cupertinoState = 'cupertinoClosed';
    this.map.flyToBounds(this.map.currentBounds);
  }
  //
  showPane() {
    let cid = 0;
    if ( this.loadContainer > 0 ) {
      cid = this.loadContainer;
    }
    else {
      cid = this.map.currentContainer.id
    }
    this.api.getContainer(cid).subscribe((container) => {
      this.formatContainer(container);
      if ( this.loadContainer > 0 ) {
        this.map.currentContainer = container;
        this.loadContainer = 0;
        this.map.loadMarkers([container], true);
      }
      this.infoPane.present({animate: true});
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
  //
  hidePane() {
    //Si está en sub-programa vuelvo al listado
    if ( this.list == 2 ) {
      this.map.map.removeLayer(this.map.subZone);
      this.map.showZones(true);
      this.list = 1;
    }
    else {
      this.map.removeZones();
      this.infoPane.destroy({animate: true});
    }
  }
  //
  loadNearbyContainers(fly: boolean) {
    this.api.loadNearbyContainers(this.map.getBoundingCoords())
    .subscribe((containers) => {
      this.map.loadMarkers(containers, fly);
    });
  }
  //
  gotoLocation() {
    this.geo.getCurrentPosition({ enableHighAccuracy: false }).then( (resp) => {
      this.uLocation = true;
      this.map.userPosition = [resp.coords.latitude, resp.coords.longitude];
      this.notification.closeNotificationId('noLoc');
      this.api.getCountryByLocation(this.map.userPosition).subscribe(
        (country) => {
          this.session.setCountry(country);
        }
      );
      this.api.getNearbyContainers(2, [resp.coords.latitude, resp.coords.longitude])
      .subscribe((containers) => {
          this.map.loadMarkers(containers, true);
      });
      //this.map.flytomarker(this.map.userPosition, 15);
    }).catch((error) => {
      this.noLocation();
      this.uLocation = true;
      if ( this.session.country != undefined ) {
        this.api.getNearbyContainers(2, [this.map.center.lat, this.map.center.lng])
        .subscribe((containers) => {
          this.map.loadMarkers(containers, true);
        });
      }
    });
    setTimeout( () => {
      if ( !this.uLocation ){
        this.noLocation();
      }
    }, 5000);
  }
  noLocation() {
    let noRes = {
      id: 'noLoc',
      type: 'notification',
      class: 'warnings',
      title: 'No pudimos localizarte',
      note: 'Quizás no le diste permiso o la localización está desactivada. Prueba iniciar la app con la localización activada. Puedes seleccionar tu ubicación tocando el mapa.',
    };
    this.notification.showNotification(noRes);
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
    //Horario
    let days = [];
    if ( Object.keys(container.schedules).length ) {
      let d=new Date();
      var today = d.getDay().toString();
      for ( let d in this.weekday ) {
        let selected = '';
        if ( d == today ) {
          selected = 'today';
        }
        if( container.schedules.hasOwnProperty(d) ) {
          if ( container.schedules[d].closed == true ) {
            days.push( {class: selected, text: this.weekday[d] + ': Cerrado'} );
          }
          else {
            let sched = container.schedules[d];
            let day_text = this.weekday[d] + ': ' + sched.start + ' a ' + sched.end;
            if ( sched.hasOwnProperty('start2') ){
              day_text += ' y ' + sched.start2 + ' a ' + sched.end2;
            }
            days.push( {class: selected, text: day_text} );
          }
        }
        else {
          days.push( {class: selected, text: this.weekday[d] + ': - '} );
        }
      }
    }
    container.schedules = days;
  }
  toggleSched() {
    this.showSched = !this.showSched;
  }
  geolocate() {
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
  newImage(event: any, id: number) {
    if ( this.authGuard.isActive() ) {
      this.fileType = { name: 'Cargando...', class: 'camera'};
      this.loadingImg = true;
      let fileT = event.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(fileT);
      reader.onload = () => {
        this.loadingImg = false;
        // get the blob of the image:
        let file = new Blob([new Uint8Array((reader.result as ArrayBuffer))]);
        this.utils.uploadImage(file, fileT, id).subscribe(
          uploaded => {
            if (uploaded) {
              this.fileType = { name: 'Foto cargada', class: 'checkmark-circle'};
            }
            else {
              this.fileType = { name: 'Problema al cargar', class: 'close-circle'};
            }
          },
          () => {
            this.fileType = { name: 'Problema al cargar', class: 'close-circle'};
          }
        );
        // create blobURL, such that we could use it in an image element:
        //let blobURL: string = URL.createObjectURL(this.file);
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    }
  }
  checkLogin(e) {
    if ( !this.authGuard.isActive() ) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  //
  subprograms4location() {
    var point: [number, number];
    if ( this.map.userPosition != undefined ) {
      point = this.map.userPosition;
    }
    else {
      point = [ this.map.map.getCenter().lat, this.map.map.getCenter().lng ];
      this.map.userPosition = point;
      this.map.loadMarkers([], false);
    }
    this.api.getSubprograms4Location(point).subscribe((subprograms) => {
      this.map.removeZones();
      if ( subprograms.length > 1 ) {
        this.list = 1;
        var zones = subprograms[0].zone.location;
        subprograms.forEach( (subp, i) => {
          if ( i != 0 ) {
            zones.features.push(subp.zone.location.features[0]);
          }
          subprograms[i].program_icon = this.programs_sum[subp.program_id].icon;
          subprograms[i].program = this.programs_sum[subp.program_id].name;
        });
        this.subprograms = subprograms;
        this.infoPane.present({animate: true});
        this.map.loadZones(zones);
      }
      else if ( subprograms.length == 1) {
        this.list = 2;
        var subp = subprograms[0];
        subp.program_icon = this.programs_sum[subp.program_id].icon;
        subp.program = this.programs_sum[subp.program_id].name;
        this.subprograms = [subp];
        this.subprogramShow(0);
        this.infoPane.present({animate: true});
      }
      else {
        let noRes = {
          id: 'noSub',
          type: 'notification',
          class: 'alert',
          title: 'No hay datos para la zona',
          note: 'No tenemos datos de organizaciones que trabajen en la zona. ¿Conoces alguna?',
          link: this.currentUrl,//'map.toggleZone',
          link_title: 'Ver Zonas',
          link_params: {"zones": 1}
        };
        this.notification.showNotification(noRes);
      }
    });
  }
  //
  subprogramShow(index: number) {
    this.subprogram = this.subprograms[index];
    this.list = 2;
    this.map.removeZones();
    this.map.showSubZone(this.subprograms[index].zone.location.features[0]);
  }
  //
  getZones() {
    let zoneBtn = document.querySelector(".map-zones");
    if ( this.zoneVisible == 3 ) {
      this.map.removeZones();
      this.zoneVisible = 0;
    }
    else if ( this.zoneVisible == 0 ) {
      this.zoneVisible = 1;
      zoneBtn.classList.add('active');
      setTimeout( () => {
        if ( this.zoneVisible == 1 ) {
          this.zoneVisible = 2;
          zoneBtn.classList.remove('active');
        }
      }, 5000);
    }
    else {
      let bounds = this.map.getBoundsWKT();
      this.api.getZones4Boundaries(bounds).subscribe(
        (zones) => {
          this.map.removeZones();
          zoneBtn.classList.remove('active');
          this.zoneVisible = 3;
          this.map.loadZones(zones);
        }
      );
    }
  }
  //
  activateZone(){
    this.zoneVisible = 1;
    this.getZones();
  }
  //
  openPhotos() {
    if ( this.container.photos.length > 0 ) {
      this.utils.photos = this.container.photos;
      this.utils.showPhotos = true;
      this.utils.showOverlay = true;
    }
    else {
      let noRes = {
        id: 'noPhoto',
        type: 'notification',
        class: 'warnings',
        title: 'No hay fotos de este contenedor',
        note: 'Ayudemos a otros usuarios en su búsqueda, sé el primero en subir una foto!',
      };
      this.notification.showNotification(noRes);
    }
  }
}
