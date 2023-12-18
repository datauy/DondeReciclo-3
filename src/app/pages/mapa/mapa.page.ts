import { Component, OnInit, AfterViewInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Event, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

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


import { environment } from 'src/environments/environment';

import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss']
})
export class MapaPage implements OnInit {

  @ViewChild("stylesContainer", {static: true}) private stylesDist: ElementRef;
  @ViewChild("leafletMap", {static: false}) private mapEl: ElementRef;
  @ViewChild("infoContainer", {static: false}) private infoContainer: ElementRef;
  @ViewChild("serviceContainer", {static: false}) private serviceContainer: ElementRef;
  @ViewChild("mapSection", {static: false}) private mapContainer: ElementRef;
  address: string[];
  container = {} as Container;
  infoPane: CupertinoPane;
  servicesPane: CupertinoPane;
  geoLocationActive = false;
  locationLoop = 0;
  subprograms = <Subprogram[]>([]);
  subprogram: Subprogram;
  zones: any;
  reportLocationActive = false;
  //infoPaneEl: HTMLDivElement;
  loadingImg = false;
  fileType: any = {
    name: 'Subir otra foto',
    class: 'camera'
  };
  weekday = new Weekdays;
  showSched = false;
  //Displays: 0:Es contenedor (default), 4: subprograma c/zona precargada
  list = 0;
  //Estados: 0:Cerrado-Inactivo, 1:Abierto, 2:Cerrado-Activado, 3:Cerrado-Mostrando? O debiera ser abierto??
  zoneVisible = 0;
  shareVisible = 0;
  //Load data over recommended zoom
  loadContainer = 0;
  initDataLoaded = false;
  autoSearch = false;
  autoSearchItem:any;
  loadContainers: string;
  loadSubIds: string;
  panelTop = true;
  routing = false;
  
  public userPopup = L.popup().on("remove", this.closePopUp, this);

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
    private renderer: Renderer2
    // private backbuttonSubscription: Subscription
  ) {
    this.session = session;
  }
  //
  ngOnInit() {
    this.session.isShowSlider().then((toShow) => {
      this.session.watchSlider(toShow);
    });
    // this.app = document.querySelector('app-search');
    this.session.homeUrl = this.router.url.split('?')[0];
    if ( window.innerWidth >= 560 ) {
      this.panelTop = false;
    }
    //this.loadMap();
    //Subscribe after initial data is loaded
    this.map.pinClicked.subscribe(
      pinData => {
        if ( pinData ) {
          this.list = 0;
          if ( this.infoPane != undefined ) {
            this.showPane();
          }
        }
      }
    );
    this.map.zoneClicked.subscribe(
      distance => {
        if (this.map.zoneClick < 0 ) {
          if ( distance == 0.0002 ) {
            if ( this.zoneVisible == 3 ) {
              this.subprograms4location(distance);
              this.servicesPane.moveToBreak('middle');
            }
            else {
              this.subprograms4location();
            }
          }
        }
        else {
          if (this.subprograms.length == 0 ) {
            this.list = 4;
            //this.map.loadCustomZones(subp.locations);
            //this.map.loadZones(subp.locations);
            if ( typeof(this.servicesPane) != 'undefined' && this.servicesPane.currentBreak() == 'top' ) {
              this.servicesPane.moveToBreak('middle');
            }
            if ( typeof(this.infoPane) != 'undefined' ) {
              this.infoPane.present({animate: true});
            }
          }
          else {
            this.subprogramShow(this.map.zoneClick);
          }
          this.map.zoneClick = -1;
        }
      }
    );
    this.map.userPositionChanged.subscribe(
      pos => {
        if ( pos && pos != null ) {
          this.subprograms4location();
        }
      }
    );
    this.session.countryChanged.subscribe(
      countryName => {
        if ( this.initDataLoaded == true && countryName != '' ) {
          let userPos: [number, number];
          //Set possition and load services
          userPos = [environment[countryName].center.lat, environment[countryName].center.lon];
          this.map.setUserPosition(userPos);
          // Si no está ejecutando la geoloc cargamos contenedores, sino lo maneja la geoloc
          if ( !this.geoLocationActive ) {
            this.api.getNearbyContainers(2, userPos).subscribe(
              (containers) => {
                this.map.loadMarkers(containers, true);
              }
            );
          }
        }
      }
    );
    this.map.mapChanged.subscribe(
      change => {
        if (change) {
          if ( this.map.map != undefined && this.list == 0 ) {
            if (( this.map.map.getZoom() >= 14 && !this.map.saturationWarn ) || this.map.eagerLoad ) {
              this.notification.closeNotificationId('zoom');
              this.api.loadNearbyContainers(this.map.getBoundingCoords())
              .subscribe((containers) => {
                  this.map.loadMarkers(containers, false);
              });
              if ( this.zoneVisible == 3 ) {
                this.zoneVisible = 2;
                this.getZones(false);
              }
            }
            else {
              let noZoom = {
                id: 'zoom',
                type: 'notification',
                class: 'alert',
                title: 'No estamos cargando datos, acércate al mapa',
                note: 'Debido al nivel de zoom y para proteger el funcionamiento de la aplicación y el dispositivo hemos desactivado la carga automática de datos mientras navega.',
                link: this.session.homeUrl,
                link_title: 'Cargar de todas formas',
                link_params: {'eagerLoad': 1}
                //link_fragment: "load-data"
              };
              this.notification.showNotification(noZoom);
            }
            this.map.saturationWarn = false;
          }
        }
      }
    );
    /*this.router.events.pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: Event) => {
      console.log("ROUTER EVENT", event);
      if ( event instanceof NavigationEnd && event.id != this.processed_route ) {
        this.processed_route == event.id;
        console.log("ROUTER EVENT2", event);
        this.mapaRouter(event);
      }
    });*/
    //load data
    this.api.initialDataLoaded.subscribe(
      (loaded) => {
        if (loaded) {
          this.initDataLoaded = true;
          //load dinamic styles
          const classStyle = this.renderer.createText(this.api.material_styles);
          const newStyleElement = this.renderer.createElement('style');
          this.renderer.appendChild(newStyleElement, classStyle);
          this.renderer.appendChild(this.stylesDist.nativeElement, newStyleElement);
          this.mapaRouter();
        }
      }
    );
  }
  
  ngAfterViewInit() {
    this.loadMap();
    this.loadServicesPane();
    this.loadInfoPane();
  }

  loadMap(center?: L.LatLng) {
    
    if ( center == undefined ) {
      center = L.latLng(-11.336196, -63.605775);
    }
    //this.animating = true;
    if ( this.map.map != undefined ) this.map.map.remove();
    //if ( this.map.map == undefined ) {
        this.map.map = new L.Map(this.mapEl.nativeElement, {minZoom:4}).setView(center, 4);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        }).addTo(this.map.map);
  
        if ( this.map.userPosition ) {
          this.map.createUserMarker();
        }
        //Create user marker upon click
        this.map.map.on("click", <LeafletMouseEvent>(e) => {
          //Do not change user position if zone clicked
          if ( this.map.zoneClick < 0 ) {
            if (this.map.userMarker) { // check
              this.map.map.removeLayer(this.map.userMarker); // remove
            }
            //Do not propagate since click is handled
            this.map.setUserPosition([e.latlng.lat, e.latlng.lng], false);
            this.map.createUserMarker();
          }
          if (this.map.route) {
            this.map.route.spliceWaypoints(0, 1, e.latlng);
          }
          this.map.clickZone(0.0002);
        });
        this.map.map.on('zoomend', this.map.zoomChange, this.map);
        this.map.map.on('dragend', this.map.centerChange, this.map);
        //this.map.once('moveend', this.toggleAnimation, this);
        this.session.reloadMap = false;
      //}
      //else {
      //  this.map.map.invalidateSize();
      //}
    return true;
  }

  //
  ionViewWillEnter() {
    //
    this.session.showBackButton = false;
    //this.loadMap();
    this.mapaRouter();
    if ( typeof(this.servicesPane) != 'undefined' ) {
      this.servicesPane.present({animate: true})
    }
    else {
      this.loadServicesPane();
    }
    if ( typeof(this.infoPane) == 'undefined' ) {
      this.loadInfoPane();
    }
  }
  //
  ionViewWillLeave() {
    //Remove notification messages
    this.notification.closeNotificationId('noLoc');
    this.notification.closeNotificationId('zoom');
    this.notification.closeNotificationId('noSub');
    this.notification.closeNotificationId('noPhoto');
    this.notification.closeNotificationId('noSearch');
    //Remove panels
    /*if ( this.servicesPane.isPanePresented() ){
      this.servicesPane.destroy();
    }*/
    if ( this.infoPane.isPanePresented() ){
      this.infoPane.destroy();
    }
    this.list = 0;
    //Remove search variables
    this.session.showSearchItem = false;
    delete this.session.searchItem;
    delete this.loadContainer; 
    delete this.autoSearch;
    delete this.autoSearchItem;
    //Remove loaded objects
    delete this.container;
    delete this.loadContainers;
    delete this.loadSubIds;
    this.map.removeZones();
    this.map.removeCustomZones();
  }
  mapaRouter(event?: any) {
    if ( this.initDataLoaded && !this.routing ) {
      this.routing = true;
      var section = this.router.url.split('/')[1];
      if ( ['', '/', 'subprograma', 'contenedores', 'contenedor', 'intro', 'residuo', 'material', 'lugar'].indexOf(section) != -1 ) {
        if ( event != undefined ) {
          var url_arr = event.url.split('?');
          // Do not do anything if URL is unchanged
          if ( 1 in url_arr ) {
            if ( url_arr[1].startsWith('zones') ) {
              this.activateZone();
            }
            if ( url_arr[1].startsWith('eagerLoad') ) {
              this.map.eagerLoad = true;
              this.map.mapChanges();
              //Set eager load for 10 secs
              setTimeout( () => {
              this.map.eagerLoad = false;
              }, 10000);
            }
            this.router.navigate([this.session.homeUrl]);
            this.routing = false;
          }
          //No need to continue
          /*if ( url_arr[0] == this.session.homeUrl ) {
            return;
          }*/
        }
          this.loadPosition(false).then(() => {
          let params = this.route.snapshot.queryParams;
    
          if ( params.hasOwnProperty('zones') && params.zones == 1 ) {
            this.activateZone();
            this.router.navigate([this.session.homeUrl]);
            this.routing = false;
          }
          /*No allow eager in Load
          if ( params.hasOwnProperty('eagerLoad') && params.eagerLoad == 1 ) {
            console.log('EAGER');
              this.eagerLoad = true;
          }*/
          // route for childs and params
          let objectLocation = false;
          if ( this.route.snapshot.params['materialID'] != undefined && this.route.snapshot.params['materialID'] > 0 ) {
            this.autoSearch = true;
            this.autoSearchItem = this.api.materials[this.session.country][this.route.snapshot.params['materialID']];
          }
          if ( this.route.snapshot.params['wasteID'] != undefined && this.route.snapshot.params['wasteID'] > 0 ) {
            this.autoSearch = true;
            this.autoSearchItem = this.route.snapshot.params['wasteID'];
          }
          //MAP SERVICES
          if ( this.route.snapshot.params['subsID'] != undefined && this.route.snapshot.params['subsID'].length > 0 ) {
            this.loadSubIds = this.route.snapshot.params['subsID'];
            this.api.getSubContainers(this.loadSubIds).subscribe(
              (containers) => {
                this.map.loadMarkers(containers, true);
              }
            );
            this.api.getSubPrograms(this.loadSubIds).subscribe(
              (subp) => {                             
                this.list = 3;
                if ( subp.subprograms.length == 1 ) {
                  this.subprogram = this.formatSubProgram(subp.subprograms)[0];
                  if ( typeof(this.infoPane) != 'undefined' ) {
                    this.infoPane.present({animate: true});
                  }
                }
                else {
                  this.subprograms = this.formatSubProgram(subp.subprograms);
                  if ( typeof(this.servicesPane) != 'undefined' ) {
                    this.servicesPane.moveToBreak('middle');
                    this.session.cupertinoState = 'cupertinoOpen';
                  }
                }
                //if ( this.zones == undefined || this.zones.features.length <= 1 ) {
                  this.zones = subp.locations;
                //}
                this.map.loadCustomZones(subp.locations);
                this.map.loadZones(subp.locations);
                this.routing = false;
              }
            );
          }
          else {
            this.subprograms4location();
            if ( this.route.snapshot.params['containersID'] != undefined && this.route.snapshot.params['containersID'].length > 0 ) {
              this.loadContainers = this.route.snapshot.params['containersID'];
              this.api.getContainersIds(this.loadContainers).subscribe(
                (containers) => {
                  this.map.loadMarkers(containers, true);
                  this.routing = false;
                }
              );
            }
            else if ( this.route.snapshot.params['containerID'] != undefined && this.route.snapshot.params['containerID'] > 0 ) {
                this.loadContainer = this.route.snapshot.params['containerID'];
                objectLocation = true;
                this.showPane();
                this.routing = false;
            }
            else if ( this.route.snapshot.params['coords'] != undefined ) {
              var latlng = this.route.snapshot.params['coords'].split(',');
              if ( latlng[1] != undefined ) {
                this.map.setUserPosition(latlng);
                this.loadPosition(true);
              }
              else {
                this.gotoLocation();
                this.routing = false;
              }
            }
            else {
                this.gotoLocation();
                this.routing = false;
            }
          }
        });
      }
    }
  }
  activateSearch(object) {
    this.map._autoSearch.next(object);
  }
  // dragMapCupertino(){  m
  //   this.infoPaneEl = document.querySelector('.cupertino-pane > .pane');
  //   const paneHeight = this.infoPaneEl.getBoundingClientRect().top;
  //   this.mapEl.style.height = paneHeight.toString() + 'px';
  //   console.log(this.infoPaneEl.getBoundingClientRect().top);
  //   console.log(this.mapEl.clientHeight);
  // }
  //
  breakPointMapCupertino(className){
    var cupertinoBrake = '';
    if (className == 'services-pane') {
      cupertinoBrake = this.servicesPane.currentBreak();
      if (cupertinoBrake == 'bottom') {
        this.zoneVisible = 0;
        this.map.removeZones();
        if ( this.list == 3 && this.routing_load() ) {
          this.list = 0;
          this.session.cupertinoState = 'cupertinoClosed';
          delete this.loadSubIds;
          this.gotoLocation();
        }
      }
      else {
        this.zoneVisible = 3;
        this.map.loadZones(this.zones);
      }
    }
    else {
      if ( this.infoPane.isPanePresented() ) {
        cupertinoBrake = this.infoPane.currentBreak();
      }
    }
     document.querySelector('.'+className).className = className + ' cupertino-pane ' + cupertinoBrake;
  }
  //
  loadInfoPane() {
    var initPane: ('top' | 'middle' | 'bottom');
    initPane = "middle";
    let panelOptions = {
      parentElement: this.mapContainer.nativeElement, // Parent container
      // backdrop: true,
      bottomClose: true,
      //fitHeight: fit,
      buttonDestroy: false,
      showDraggable: true,
        //simulateTouch: true,
      topperOverflow: false,
      fitScreenHeight: false,
      topperOverflowOffset: 200,
      bottomOffset: 30,
      clickBottomOpen: true,
      //screenHeightOffset: Math.round(topBreak),
      //followerElement: '#map',
      //dragBy: ['.pane #map'],
      initialBreak: initPane,
      breaks: {
        top: {
          enabled: this.panelTop,
          //offset: (topBreak),
          height: Math.round(window.innerHeight*.9),
        },
        middle: {
          enabled: true,
          //offset: window.innerHeight*.7,
          height: Math.round(window.innerHeight*.65),
        },
      },
      onTransitionEnd: () => this.breakPointMapCupertino('info-pane'),
      onWillPresent: () => this.cupertinoShow(),
      // onBackdropTap: () => this.infoPane.hide(),
      onWillDismiss: () => this.hidePane(false),
    };
    //document.querySelector(".cupertino-pane").classList.add(initPane);
    this.infoPane = new CupertinoPane(
      this.infoContainer.nativeElement, // Pane container selector
      panelOptions
    );
  }
  //
  loadServicesPane() {
    var initPane: ('top' | 'middle' | 'bottom');
    initPane = "bottom";
    let panelServices = {
      parentElement: this.mapContainer.nativeElement, // Parent container
      // backdrop: true,
      bottomClose: false,
      //fitHeight: fit,
      buttonDestroy: false,
      showDraggable: true,
        //simulateTouch: true,
      initialBreak: initPane,
      clickBottomOpen: false,
      bottomOffset: 30,
      topperOverflow: false,
      topperOverflowOffset: 200,
      breaks: {
        top: {
          enabled: this.panelTop,
          //offset: (topBreak),
          height: Math.round(window.innerHeight*.9),
        },
        middle: {
          enabled: true,
          //offset: window.innerHeight*.7,
          height: Math.round(window.innerHeight*.65),
        },
        bottom: {
          enabled: true,
          //offset: window.innerHeight*.7,
          height: 210,
        },
      },
      onTransitionEnd: () => this.breakPointMapCupertino('services-pane'),
    };
    
    //document.querySelector(".cupertino-pane").classList.add(initPane);
    this.servicesPane = new CupertinoPane(
      this.serviceContainer.nativeElement, // Pane container selector
      panelServices
      );
      this.servicesPane.present({animate: true});
  }
  //
  toggleServices() {
    if ( this.servicesPane.currentBreak() == 'bottom' ) {
      if ( this.panelTop ) {
        this.servicesPane.moveToBreak('top');
      }
      else {
        this.servicesPane.moveToBreak('middle');
      }
    }
    else {
      this.session.cupertinoState = 'cupertinoClosed';
      this.servicesPane.moveToBreak('bottom');
    }
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
  hidePane(destroy=true) {
    //Si está en sub-programa vuelvo al listado
    //this.list = 0;
    this.session.showSearchItem = true;
    if ( this.zones ) {
      this.map.loadCustomZones(this.zones);
    }
    if ( this.map.subZone != undefined ) {
      this.map.map.removeLayer(this.map.subZone);
    }
    if ( this.zoneVisible != 3 ) {
      this.map.removeZones();
    }
    if ( this.map.route != null ) {
      this.map.map.removeControl(this.map.route);
      this.map.route = null;
    }
    this.session.cupertinoState = 'cupertinoClosed';
    /*if ( this.map.currentContainer != undefined ) {
      this.map.flyToBounds([
        [this.map.currentContainer.latitude, this.map.currentContainer.longitude],
        this.map.userPosition
      ]);
    }
    else {
      this.map.flytomarker(this.map.userPosition, this.map.zoom);
    }*/
    if ( this.list == 2 ||  this.list == 4 ) {
      if (this.map.subZone !== undefined ) {
        this.map.map.removeLayer(this.map.subZone);
      }
      //Salvo que sea un único subprograma
      if (this.subprograms.length > 1 ) {
        this.map.showZones(true);
        this.servicesPane.moveToBreak('middle');
        this.api.getSubContainers(this.subprograms.map(sub => {return sub.id.toString()}).join(',')).subscribe(
          (containers) => {
            this.map.loadMarkers(containers, true);
          }
        );
      }
      else {
        //Reload subprograms and data
        this.gotoLocation();
      }
    }
    else if ( this.list == 3 ) {
      this.zoneVisible = 0;
      delete this.loadSubIds;
      this.gotoLocation(true);
      this.servicesPane.moveToBreak('bottom');
    }
    if ( this.infoPane.isPanePresented() && destroy ) {
      this.zoneVisible = 0;
      this.infoPane.destroy({animate: true});
    }
    setTimeout( () => {
      this.map.map.invalidateSize();
    }, 500);
  }
  //
  gotoLocation(load=true) {
    this.geoLocationActive = true;
    this.geo.getCurrentPosition({ enableHighAccuracy: false }).then( (resp) => {
      this.map.setUserPosition([resp.coords.latitude, resp.coords.longitude]);
      this.notification.closeNotificationId('noLoc');
      this.api.getCountryByLocation(this.map.userPosition).subscribe(
        (country) => {
          this.session.setCountry(country, false);
          if ( this.autoSearch ) {
            this.activateSearch(this.autoSearchItem);
            this.geoLocationActive = false;  
          }
          else {
            //Check routing load
            if (load && this.routing_load() ) {
              this.subprograms4location();
              this.api.getNearbyContainers(2, [resp.coords.latitude, resp.coords.longitude])
              .subscribe((containers) => {
                this.map.loadMarkers(containers, true);
                this.geoLocationActive = false;
              });
            }
            else {
              this.geoLocationActive = false;
            }
          }
        }
      );
      //this.map.flytomarker(this.map.userPosition, 15);
    }).catch((error) => {
      this.noLocation(load);
    });
    setTimeout( () => {
      if (this.geoLocationActive ) {
        this.noLocation(load);
      }
    }, 3000);
  }
  noLocation(load=true) {
    //Desactivamos ya que las llamadas sólo se hacen desde geoloc que falla
    this.geoLocationActive = false;
    let noRes = {
      id: 'noLoc',
      type: 'notification',
      class: 'warnings',
      title: 'Aún no pudimos localizarte',
      note: 'Quizás no le diste permiso o la localización está desactivada. Prueba iniciar la app con la localización activada. Puedes seleccionar tu ubicación tocando el mapa.',
    };
    this.locationLoop += 1;
    this.notification.showNotification(noRes);
    this.loadPosition(load);
  }
  //
  loadPosition(load) {
    return this.map.getUserPosition().then(
      (res) => {
        if ( !this.geoLocationActive || this.locationLoop >= 3 ) {
          //Si no tiene  localización preguntamos por el país y sino el centro del mapa (sólo cuando aún no elijió el país)
          if ( (res == undefined || res.length == 0) && this.map.center != undefined ) {
            if ( this.session.country != undefined ) {
              this.map.setUserPosition([this.map.center.lat, this.map.center.lng]);
            }
            else {
              this.map.setUserPosition([this.map.center.lat, this.map.center.lng]);
            }
          }
          if ( this.map.userPosition != undefined ) {
            this.locationLoop = 0;
            if ( this.autoSearch ) {
              //Activa search que enruta al usuario con contenedores filtrados
              this.activateSearch(this.autoSearchItem);
            }
            else {
              if ( load ) {
                this.subprograms4location();
                this.api.getNearbyContainers(2, this.map.userPosition)
                .subscribe((containers) => {
                  this.map.loadMarkers(containers, true);
                });
              }
            }
          }
          else {
            if ( this.locationLoop < 3 ) {
              //Se supone que no tiene localización activada y no ha seleccionado el país, démosle tiempo
              setTimeout( () => {
                this.gotoLocation();
              }, 3000);
            }
          }
        }
        return true;
      }
    );
  }
  //
  routing_load() {
    return this.loadSubIds == undefined && this.loadContainers == undefined && this.loadContainer == undefined 
  }
  //
  formatContainer(container: Container) {
    container.type_icon = this.api.container_types[container.type_id].icon;
    container.program_icon = this.api.programs[container.program_id].icon ? this.api.programs[container.program_id].icon : '/assets/custom-icons/dr-generic.svg';
    container.program = this.api.programs[container.program_id].name;
    this.container = container;
    //Horario
    let days = [];
    if ( Object.keys(container.schedules).length ) {
      let d=new Date();
      var today = d.toLocaleDateString('es', { weekday: 'long' });
      container.schedules.forEach( day_obj => {
        let selected = '';
        if ( day_obj.day != undefined ) {
          if ( day_obj.day.toLowerCase() == today ) {
            selected = 'today';
          }
          if ( day_obj.closed == true ) {
            days.push( {class: selected, text: day_obj.day + ': Cerrado'} );
          }
          else {
            let day_text = day_obj.day + ': ' + day_obj.start + ' a ' + day_obj.end;
            if ( day_obj.hasOwnProperty('start2') ){
              day_text += ' y ' + day_obj.start2 + ' a ' + day_obj.end2;
            }
            days.push( {class: selected, text: day_text} );
          }
        }
      });
    }
    this.container.schedules = days;
  }
  //
  formatSubProgram(subprograms) {
    subprograms.forEach( (subp, i) => {
      subprograms[i].program_icon = this.api.programs[subp.program_id].icon ? this.api.programs[subp.program_id].icon : '/assets/custom-icons/dr-generic.svg';
      subprograms[i].program = this.api.programs[subp.program_id].name;
      /*if ( subprograms[i].materials.length != 0 ) {
        subprograms[i].receives_mat = [];
        subprograms[i].materials.forEach((p) => {
          subprograms[i].receives_mat.push(this.api.materials[this.session.country][p]);
        });
      }*/
    });
    return subprograms;
  }
  //
  toggleSched() {
    this.showSched = !this.showSched;
  }
  //
  geolocate() {
    this.locationLoop = 0;
    this.gotoLocation();
  }
  //
  getAddress(lat: number, long: number) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.geocoder.reverseGeocode(lat, long, options).then(results => {
      this.address = Object.values(results[0]).reverse();
    });
  }
  //
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
  subprograms4location(distance = null) {
    if ( this.map.map != undefined ) {
      //this.session.isLoading = true;
      var point: [number, number];
      if ( this.map.userPosition != undefined ) {
        point = this.map.userPosition;
      }
      else {
        point = [ this.map.map.getCenter().lat, this.map.map.getCenter().lng ];
        this.map.setUserPosition(point, false);
      }
      this.api.getSubprograms4Location(point, distance).subscribe(
        (subprograms_zones) => {
          var subprograms = subprograms_zones.subprograms;
          let fixedPos:[number, number] = [this.map.userPosition[0] - 0.002, this.map.userPosition[1] ];
          if ( subprograms.length > 0 ) {
            this.formatSubProgram(subprograms);
            this.zones = subprograms_zones.locations;
            this.subprograms = subprograms;

            this.map.removeZones();
            this.map.removeCustomZones();
            if ( this.zoneVisible == 3 ) {
              this.map.loadZones(this.zones);
            }
            this.map.loadCustomZones(this.zones);
          }
          /*else if ( subprograms.length == 1) {
            this.map.removeZones();
            this.map.removeCustomZones();
            //Sobreescribe si no hay listados, para poder volver a ellos o no...
            if ( this.zones == undefined || this.zones.features.length <= 1 ) {
              this.zones = subprograms_zones.locations;
            }
            if ( this.subprograms == undefined || this.subprograms.length <= 1 ) {
              this.subprograms = subprograms;
            }
            this.formatSubProgram(subprograms);
            this.subprogramShow(0, 4, subprograms[0]);
            //this.map.flytomarker(fixedPos, this.map.zoom);
            this.map.loadCustomZones(this.zones);
          }*/
          else {
            this.subprograms = [];
          }
          this.session.isLoading = false;
        },
        err => this.session.isLoading = false,
        () => this.session.isLoading = false
      );
    }
  }
  //
  subprogramShow(index: number, list = 4, subprogram?) {
    if ( subprogram != null ) {
      this.subprogram = subprogram;
    }
    else {
      this.subprogram = this.subprograms[index];
    }

    this.list = list;
    this.map.removeZones();
    this.map.removeCustomZones();
    var zone_found = false;
    if ( this.zones.features.length ) {
      for (var i = 0; i < this.zones.features.length; i++) {
        if (this.zones.features[i].id == this.subprogram.zone.location_id ) {
          zone_found = true;
          break;
        }
      }
      if (zone_found) {
        this.map.showSubZone(this.zones.features[i]);

      }
    }
    this.api.getSubContainers(this.subprogram.id.toString()).subscribe(
      (containers) => {
        this.map.loadMarkers(containers, true);
      }
    );
    if ( this.servicesPane.currentBreak() == 'top' ) {
      this.servicesPane.moveToBreak('middle');
    }
    this.infoPane.present({animate: true});
  }
  //
  getZones(getNext = true) {
  let zoneBtn = document.querySelector(".map-zones");
    if ( this.zoneVisible == 3 ) {
      zoneBtn.classList.remove('selected');
      this.map.removeZones();
      this.zoneVisible = 0;
    }
    else if ( this.zoneVisible == 0 ) {
      zoneBtn.classList.remove('selected');
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
      this.zoneVisible = 3;
      zoneBtn.classList.remove('active');
      this.map.loadZones(this.zones);
      /*let bounds = this.map.getBoundsWKT();
      this.api.getZones4Boundaries(bounds).subscribe(
        (zones) => {
          this.map.removeZones();
          zoneBtn.classList.remove('active');
          this.zoneVisible = 3;
          if ( zones['features'].length == 0 && getNext ) {
            this.api.getNextZone( [ this.map.map.getCenter().lat, this.map.map.getCenter().lng ] ).subscribe(
              (zone) => {
                this.map.loadZones(zone, true);
                this.map.showSubZone(zone[0]);
              }
            )
          }
          else {
            this.map.loadZones(zones);
          }
        }
      );*/
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
  reportLocation() {
    if ( this.reportLocationActive ) {
      this.userPopup.remove();
      this.reportLocationActive = false;
    }
    else {
      this.reportLocationActive = true;
      var latlng = this.map.userMarker.getLatLng();
      console.log("reportLocation", this.map.userMarker);
      this.userPopup.
      setContent('<a class="user-popup" href="/usuario/reportar/'+latlng.lat+','+latlng.lng +'"><span>Confirmar ubicación</span><ion-icon name="check-green"></ion-icon></a>').
      setLatLng(latlng);
      //
      this.map.userMarker.
      bindPopup(this.userPopup).
      openPopup();
    }
  }
  closePopUp() {
    this.reportLocationActive = false;
  }
  share() {
    if ( this.shareVisible ) {
      this.map.getUserPosition().then(
        (res) => {
          if (res != undefined ) {
            this.shareVisible = 2;
            var domain = 'https://dondereciclo.uy/';
            if ( this.session.country != undefined && this.session.country == 'Colombia' ) {
              domain = 'https://dondereciclo.co/';
            }
            var link = domain + 'lugar/' + res[0] + ',' + res[1];
            const selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = link;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
            setTimeout( () => {
              this.shareVisible = 0;
          }, 2500);
          }
        }
      );
    }
    else {
      this.shareVisible = 1;
      setTimeout( () => {
          this.shareVisible = 0;
      }, 5000);
    }
  }
}
