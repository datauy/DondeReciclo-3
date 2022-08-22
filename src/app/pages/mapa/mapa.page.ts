import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  address: string[];
  container = {} as Container;
  infoPane: CupertinoPane;
  uLocation = false;
  subprograms: Subprogram[];
  subprogram: Subprogram;
  zones: any;
  infoPaneEl: HTMLDivElement;
  loadingImg = false;
  fileType: any = {
    name: 'Subir otra foto',
    class: 'camera'
  };
  weekday = new Weekdays;
  showSched = false;
  //Displays: 0:Es contenedor (default), 1:Es Lista (subprogramas), 2:Es subprograma, 4: subprograma c/zona precargada
  list = 0;
  //Estados: 0:Cerrado-Inactivo, 1:Abierto, 2:Cerrado-Activado, 3:Cerrado-Mostrando? O debiera ser abierto??
  zoneVisible = 0;
  //Load data over recommended zoom
  loadContainer = 0;
  initDataLoaded = false;
  autoSearch = false;
  autoSearchItem:any;
  loadContainers: string;
  loadSubContainers: string;

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
  }
  //
  ngOnInit() {
      // this.app = document.querySelector('app-search');
    this.session.homeUrl = this.router.url.split('?')[0];
    this.loadInfoPane();
    //Subscribe after initial data is loaded
    this.map.pinClicked.subscribe(
      pinData => {
        if ( pinData ) {
          this.list = 0;
          this.showPane();
        }
      }
    );
    this.map.zoneClicked.subscribe(
      distance => {
        if ( this.list > 0 || this.zoneVisible == 1 || this.zoneVisible >= 3 ) {
          this.subprograms4location(distance);
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
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: Event) => {
      if (event instanceof NavigationEnd ) {
        this.mapaRouter(event);
      }
    });
    //load data
    this.api.initialDataLoaded.subscribe(
      (loaded) => {
        if (loaded) {
          this.initDataLoaded = true;
          this.mapaRouter();
          // route for childs and params
          if ( this.loadSubContainers != undefined || this.loadContainers != undefined ) {
            this.gotoLocation(false);
            if ( this.loadSubContainers != undefined ) {
              this.api.getSubContainers(this.loadSubContainers).subscribe(
                (containers) => {
                  this.map.loadMarkers(containers, true);
                }
              );
            }
            else {
              this.api.getContainersIds(this.loadContainers).subscribe(
                (containers) => {
                  this.map.loadMarkers(containers, true);
                }
              );
            }
          }
          else {
            if ( this.loadContainer > 0) {
              this.gotoLocation(false);
              this.showPane();
            }
            else {
              if ( this.map.userPosition == undefined ) {
                this.gotoLocation();
              }
              else {
                this.uLocation = true;
                if ( this.autoSearch ) {
                  this.activateSearch(this.autoSearchItem);
                }
                else {
                  this.api.getNearbyContainers(2, this.map.userPosition).subscribe(
                    (containers) => {
                      this.map.loadMarkers(containers, true);
                    }
                  );
                }
                //this.map.flytomarker(this.map.userPosition, 15);
              }
            }
          }
        }
      }
    );
  }
  //
  ionViewDidEnter() {
    //Carga mapa con centro en LA
    this.map.loadMap();
    //Fallback if location fails
    /*if ( this.session.country != undefined ) {
    console.log("VIEW STARTS HAY COUNTRY");
    //El resize hace un fly al centro del mapa
    this.map.resizeMap(0);
    if ( this.session.searchItem != undefined ) {
    this.session.showSearchItem = true;
        }
        //Wait 3 seconds for user location and start loading LOad nearbymap
        setTimeout( () => {
        console.log("VIEW STARTS TIMEOUT", this.map.center);
        if ( !this.uLocation ) {
        this.api.getNearbyContainers(0.5, [this.map.center.lat, this.map.center.lng]).subscribe(
        (containers) => {
        this.map.loadMarkers(containers, true);
      }
    );
    }
    }, 4000);
    }*/
  }
  //
  ionViewWillLeave() {
    this.session.showSearchItem = false;
    //Remove notification messages
    this.notification.closeNotificationId('noLoc');
    this.notification.closeNotificationId('zoom');
    this.notification.closeNotificationId('noSub');
    this.notification.closeNotificationId('noPhoto');
    this.notification.closeNotificationId('noSearch');
  }
  mapaRouter(event?: any) {
    if ( this.initDataLoaded ) {
      if ( event != undefined ) {
        var url_arr = event.url.split('?');
        // HARD RESET
        if ( this.session.lastUrl == "" ) {
          this.session.lastUrl == this.session.homeUrl;
        }
        if (
        this.session.lastUrl.startsWith("/intro/mapa")
        && this.session.lastUrl.split('?')[0] != url_arr[0]
        && url_arr[0].startsWith("/intro/mapa")
        ) {
          let q = '';
          if ( url_arr[1] != undefined ) {
            q = '?' + url_arr[1];
          }
          //console.log("ROUTER RESET:", q );
          window.location.replace( '/' + q );
        }
        // Do not do anything if URL is unchanged
        if ( 1 in url_arr ) {
          if ( url_arr[1].startsWith('zones') ) {
            this.activateZone();
          }
          if ( url_arr[1].startsWith('eagerLoad') ) {
            this.map.eagerLoad = true;
            this.map.loadMarkers(this.map.containers, false);
            //Set eager load for 10 secs
            setTimeout( () => {
            this.map.eagerLoad = false;
            }, 10000);
          }
          this.router.navigate([this.session.homeUrl]);
        }
        // Set last URL
        this.session.lastUrl = url_arr[0];
        //No need to continue
        if ( url_arr[0] == this.session.homeUrl ) {
          return;
        }
      }
      let params = this.route.snapshot.queryParams;
      if ( params.hasOwnProperty('zones') && params.zones == 1 ) {
        this.activateZone();
        this.router.navigate([this.session.homeUrl]);
      }
      /*No allow eager in Load
        if ( params.hasOwnProperty('eagerLoad') && params.eagerLoad == 1 ) {
        console.log('EAGER');
        this.eagerLoad = true;
      }*/
      if ( this.route.snapshot.params['containerID'] != undefined && this.route.snapshot.params['containerID'] > 0 ) {
        this.loadContainer = this.route.snapshot.params['containerID'];
      }
      if ( this.route.snapshot.params['materialID'] != undefined && this.route.snapshot.params['materialID'] > 0 ) {
        this.autoSearch = true;
        this.autoSearchItem = this.api.materials[this.session.country][this.route.snapshot.params['materialID']];
      }
      if ( this.route.snapshot.params['wasteID'] != undefined && this.route.snapshot.params['wasteID'] > 0 ) {
        this.autoSearch = true;
        this.autoSearchItem = this.route.snapshot.params['wasteID'];
      }
      if ( this.route.snapshot.params['containersID'] != undefined && this.route.snapshot.params['containersID'].length > 0 ) {
        this.loadContainers = this.route.snapshot.params['containersID'];
      }
      if ( this.route.snapshot.params['subsID'] != undefined && this.route.snapshot.params['subsID'].length > 0 ) {
        this.loadSubContainers = this.route.snapshot.params['subsID'];
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
  breakPointMapCupertino(){
     document.querySelector('.cupertino-pane').className = 'cupertino-pane ' + this.infoPane.currentBreak();
  }
  //
  loadInfoPane() {
    let top = true;
    var initPane: ('top' | 'middle' | 'bottom');
    initPane = "middle";
    if ( window.innerWidth >= 560 ) {
      top = false;
      //topBreak = Math.round(window.innerHeight*.7);
      document.querySelector(".cupertino-pane").classList.add("desktop");
    }
    let panelOptions = {
      parentElement: '.map-section', // Parent container
      // backdrop: true,
      bottomClose: true,
      //fitHeight: fit,
      buttonDestroy: false,
      showDraggable: true,
        //simulateTouch: true,
      topperOverflow: false,
      fitScreenHeight: false,
      topperOverflowOffset: 200,
      //bottomOffset: 20,
      clickBottomOpen: false,
      //screenHeightOffset: Math.round(topBreak),
      //followerElement: '#map',
      //dragBy: ['.pane #map'],
      initialBreak: initPane,
      breaks: {
        top: {
          enabled: top,
          //offset: (topBreak),
          height: Math.round(window.innerHeight*.9),
        },
        middle: {
          enabled: true,
          //offset: window.innerHeight*.7,
          height: Math.round(window.innerHeight*.65),
        },
      },
      onTransitionEnd: () => this.breakPointMapCupertino(),
      onWillPresent: () => this.cupertinoShow(),
      // onBackdropTap: () => this.infoPane.hide(),
      onWillDismiss: () => this.cupertinoHide(),
    };
    //document.querySelector(".cupertino-pane").classList.add(initPane);
    this.infoPane = new CupertinoPane(
      '.cupertino-pane', // Pane container selector
      panelOptions
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
    if ( this.map.currentContainer != undefined ) {
      this.map.flyToBounds([
        [this.map.currentContainer.latitude, this.map.currentContainer.longitude],
        this.map.userPosition
      ]);
    }
    else {
      this.map.flytomarker(this.map.userPosition, this.map.zoom);
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
  hidePane() {
    //Si está en sub-programa vuelvo al listado
    if ( this.list == 2 || this.list == 4 ) {
      this.map.map.removeLayer(this.map.subZone);
      this.map.showZones(true);
      this.list = 1;
      //this.zoneVisible = 2;
      //Salvo que sea un único subprograma
      if (this.subprograms.length <= 1 ) {
        this.hidePane();
      }
    }
    else {
      //Si no está mostrando las zonas
      if ( this.zoneVisible != 3 ) {
        this.map.removeZones();
      }
      else {
        this.map.showZones(false);
      }
      this.list = 0;
      this.infoPane.destroy({animate: true});
      setTimeout( () => {
        this.map.map.invalidateSize();
      }, 500);
    }
  }
  //
  gotoLocation(load=true) {
    this.geo.getCurrentPosition({ enableHighAccuracy: false }).then( (resp) => {
      this.uLocation = true;
      this.map.userPosition = [resp.coords.latitude, resp.coords.longitude];
      this.notification.closeNotificationId('noLoc');
      this.api.getCountryByLocation(this.map.userPosition).subscribe(
        (country) => {
          this.session.setCountry(country);
        }
      );
      if ( this.autoSearch ) {
        this.activateSearch(this.autoSearchItem);
      }
      else {
        if (load) {
          this.api.getNearbyContainers(2, [resp.coords.latitude, resp.coords.longitude])
          .subscribe((containers) => {
            this.map.loadMarkers(containers, true);
          });
        }
      }
      //this.map.flytomarker(this.map.userPosition, 15);
    }).catch((error) => {
      this.noLocation(load);
    });
    setTimeout( () => {
      this.noLocation(load);
    }, 3000);
  }
  noLocation(load=true) {
    if ( !this.uLocation ){
      this.uLocation = true;
      let noRes = {
        id: 'noLoc',
        type: 'notification',
        class: 'warnings',
        title: 'No pudimos localizarte',
        note: 'Quizás no le diste permiso o la localización está desactivada. Prueba iniciar la app con la localización activada. Puedes seleccionar tu ubicación tocando el mapa.',
      };
      this.notification.showNotification(noRes);
      this.map.getUserPosition().then(
        (res) => {
          if ( (res == undefined || res.length == 0) && this.map.center != undefined ) {
            this.map.userPosition = [this.map.center.lat, this.map.center.lng];
          }
          if ( this.map.userPosition != undefined ) {
            if ( this.autoSearch ) {
              this.activateSearch(this.autoSearchItem);
            }
            else {
              if (load) {
                this.api.getNearbyContainers(2, [this.map.userPosition[0], this.map.userPosition[1]])
                .subscribe((containers) => {
                  this.map.loadMarkers(containers, true);
                });
              }
            }
          }
        }
      );
    }
  }
  //
  formatContainer(container: Container) {
    container.type_icon = this.api.container_types[container.type_id].icon;
    container.program_icon = this.api.programs[container.program_id].icon ? this.api.programs[container.program_id].icon : '/assets/custom-icons/dr-generic.svg';
    container.program = this.api.programs[container.program_id].name;
    this.container = container;
    if ( container.materials.length == 0 ) {
      this.api.getWastes(container.wastes).subscribe((wastes) => {
        this.container.receives = wastes;
      });
    }
    else {
      this.container.receives = [];
      container.materials.forEach((i) => {
        this.container.receives.push(this.api.materials[this.session.country][i]);
      });
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
  //
  formatSubProgram(subprograms) {
    subprograms.forEach( (subp, i) => {
      subprograms[i].program_icon = this.api.programs[subp.program_id].icon ? this.api.programs[subp.program_id].icon : '/assets/custom-icons/dr-generic.svg';
      subprograms[i].program = this.api.programs[subp.program_id].name;
      if ( subprograms[i].materials.length != 0 ) {
        subprograms[i].receives_mat = [];
        subprograms[i].materials.forEach((p) => {
          subprograms[i].receives_mat.push(this.api.materials[this.session.country][p]);
        });
      }
    });
  }
  //
  toggleSched() {
    this.showSched = !this.showSched;
  }
  //
  geolocate() {
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
    this.session.isLoading = true;
    var point: [number, number];
    if ( this.map.userPosition != undefined ) {
      point = this.map.userPosition;
    }
    else {
      point = [ this.map.map.getCenter().lat, this.map.map.getCenter().lng ];
      this.map.userPosition = point;
      this.map.loadMarkers([], false);
    }
    this.api.getSubprograms4Location(point, distance).subscribe(
      (subprograms_zones) => {
        var subprograms = subprograms_zones.subprograms;
        let fixedPos:[number, number] = [this.map.userPosition[0] - 0.002, this.map.userPosition[1] ];
        if ( subprograms.length > 1 ) {
          this.list = 1;
          this.map.removeZones();
          this.formatSubProgram(subprograms);
          this.zones = subprograms_zones.locations;
          this.subprograms = subprograms;
          this.infoPane.present({animate: true});
          this.map.loadZones(this.zones);
          this.map.flytomarker(fixedPos, this.map.zoom);
        }
        else if ( subprograms.length == 1) {
          this.map.removeZones();
          if ( this.zones == undefined || this.zones.features.length <= 1 ) {
            this.zones = subprograms_zones.locations;
          }
          if ( this.subprograms == undefined || this.subprograms.length <= 1 ) {
            this.subprograms = subprograms;
          }
          this.formatSubProgram(subprograms);
          this.subprogramShow(0, 4, subprograms[0]);
          this.infoPane.present({animate: true});
          this.map.flytomarker(fixedPos, this.map.zoom);
        }
        else {
          let noRes = {
            id: 'noSub',
            type: 'notification',
            class: 'alert',
            title: 'No hay datos para la zona',
            note: 'No tenemos datos de organizaciones que trabajen en la zona. ¿Conoces alguna?',
            link: this.session.homeUrl,//'map.toggleZone',
            link_title: 'Ver Zonas',
            link_params: {"zones": 1}
          };
          this.notification.showNotification(noRes);
        }
        this.session.isLoading = false;
      },
      err => this.session.isLoading = false,
      () => this.session.isLoading = false
    );
  }
  //
  subprogramShow(index: number, list = 4, subprogram?) {
    if ( subprogram != null ) {
      this.subprogram = subprogram
    }
    else {
      this.subprogram = this.subprograms[index];
    }
    this.list = list;
    this.map.removeZones();
    for (var i = 0; i < this.zones.features.length; i++) {
      if (this.zones.features[i].id == this.subprogram.zone.location_id ) {
        break;
      }
    }
    this.map.showSubZone(this.zones.features[i]);
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
      let bounds = this.map.getBoundsWKT();
      this.api.getZones4Boundaries(bounds).subscribe(
        (zones) => {
          this.map.removeZones();
          if ( !zoneBtn.classList.contains('selected') ) {
            zoneBtn.classList.remove('active');
            zoneBtn.classList.add('selected');
          }
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
