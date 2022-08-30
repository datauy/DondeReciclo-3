import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Container } from "src/app/models/basic_models.model";
import { Router } from "@angular/router";
import { Storage } from  '@ionic/storage';

import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/services/session.service';

import "leaflet";
import "leaflet-routing-machine";
declare let L;

const iconUrl = 'assets/custom-icons/dr-pin.svg';
const shadowUrl = 'assets/marker-shadow.png';

const iconSVG = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   sodipodi:docname="dr-pin.svg"
   inkscape:version="1.0 (6e3e5246a0, 2020-05-07)"
   version="1.1"
   viewBox="0 0 10.583333 10.583333"
   height="40"
   width="40">
  <defs
     id="defs865" />
  <sodipodi:namedview
     inkscape:window-maximized="1"
     inkscape:window-y="27"
     inkscape:window-x="67"
     inkscape:window-height="845"
     inkscape:window-width="1533"
     units="px"
     fit-margin-bottom="0"
     fit-margin-right="0"
     fit-margin-left="0"
     fit-margin-top="0"
     showgrid="false"
     inkscape:document-rotation="0"
     inkscape:current-layer="layer1"
     inkscape:document-units="mm"
     inkscape:cy="24.871424"
     inkscape:cx="12.760924"
     inkscape:zoom="8.4074846"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     borderopacity="1.0"
     bordercolor="#666666"
     pagecolor="#ffffff"
     id="base" />
  <metadata
     id="metadata868">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     transform="translate(-178.35759,-236.37414)"
     id="layer1"
     inkscape:groupmode="layer"
     inkscape:label="Capa 1">
    <path
       style="stroke-width:0.264583"
       id="path126"
       d="m 183.64925,236.89114 c 2.1135,0 3.82694,1.64438 3.82694,3.67294 0,0.0474 -0.002,0.0952 -0.005,0.14341 0.003,0.0661 0.005,0.13282 0.005,0.19976 0,2.218 -3.43006,5.53323 -3.82694,5.53323 -0.39687,0 -3.82693,-3.31523 -3.82693,-5.53323 0,-0.0669 0.002,-0.13362 0.005,-0.19976 -0.003,-0.0482 -0.005,-0.0961 -0.005,-0.14341 0,-2.02856 1.71344,-3.67294 3.82693,-3.67294 z m 0,2.54661 c -0.78501,0 -1.42134,0.61754 -1.42134,1.37928 0,0.762 0.63633,1.37927 1.42134,1.37927 0.78502,0 1.42135,-0.61754 1.42135,-1.37927 0,-0.762 -0.63633,-1.37928 -1.42135,-1.37928 z" />
  </g>
</svg>
`
const iconDiv = iconSVG + '<img src="'+shadowUrl+'"></img>' ;

const iconDefault = L.divIcon({
  className: "dr-marker",
  // iconUrl: iconSVGUrl,
  html: iconDiv,
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
  iconAnchor: [25, 25],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = iconDefault;
L.CustomMarker = L.Marker.extend({
  // Overwrite onAdd function
  onAdd: function (map: L.Map) {
    // Run original onAdd function
    L.Marker.prototype.onAdd.call(this, map);
    // Check if there's a class set in options
    if (this.options.className) {
      // Apply className to icon and shadow
      L.DomUtil.addClass(this._icon, this.options.className);
      //L.DomUtil.addClass(this._shadow, this.options.className);
    }
    // return instance
    return this;
  }
});
@Injectable({
  providedIn: 'root'
})

export class MapService {
  map: L.Map;
  route: any;
  userPosition: [number, number];
  userMarker: L.Marker;
  currentContainer: Container;
  containers: Container[];
  currentBounds: [number, number][];
  animating: boolean;
  markers: L.LayerGroup;
  zones: L.FeatureGroup;
  subZone: L.FeatureGroup;
  saturationWarn = false;
  eagerLoad = false;
  private _pinClick = new BehaviorSubject<boolean>(false);
  private _zoneClick = new BehaviorSubject<any>(0);
  private _mapChangeSub = new BehaviorSubject<boolean>(false);
  public _autoSearch = new BehaviorSubject<any>(null);
  public zoom:number = 15;
  public center:L.LatLng;
  //
  initParams = true;

  constructor(
    private session: SessionService,
    private router: Router,
    private  storage:  Storage
  ) {
    this.session.getCountry().then( (country) => {
      if ( country != undefined ) {
        this.center = environment[country].center;
      }
    });
  }

  loadMap(center?: number[]) {
    if ( this.map == undefined || this.session.reloadMap ) {
      if ( center == undefined ) {
        center = [-11.336196, -63.605775];
      }
      this.animating = true;
      this.map = new L.Map("map", {minZoom:4}).setView(center, 4);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      }).addTo(this.map);
      if ( this.userPosition ) {
        this.userMarker = L.marker(this.userPosition, {icon: iconUser} ).addTo(this.map);
      }
      //Create user marker upon click
      this.map.on("click", <LeafletMouseEvent>(e) => {
        if (this.userMarker) { // check
          this.map.removeLayer(this.userMarker); // remove
        }
        this.setUserPosition([e.latlng.lat, e.latlng.lng]);
        this.userMarker = L.marker(this.userPosition, {icon: iconUser} ).addTo(this.map); // add the marker onclick
        if (this.route) {
          this.route.spliceWaypoints(0, 1, e.latlng);
        }
        this.clickZone(0.0002);
      });
      this.map.on('zoomend', this.zoomChange, this);
      this.map.on('dragend', this.centerChange, this);
      this.map.once('moveend', this.toggleAnimation, this);
      this.session.reloadMap = false;
    }
    return true;
  }

  loadMarkers( markers: Container[], fly = true ){
    this.loadMap();
    //Prevent marker load over saturation level
    this.containers = markers;
    if ( markers.length > environment.pinSaturation && !this.eagerLoad ) {
      this.saturationWarn = true;
      this.mapChanges();
      return;
    }
    this.saturationWarn = false;
    let mapBounds = [];
    //remove all markers and reload
    if ( this.markers != undefined ) {
      this.markers.clearLayers();
    }
    if (this.userPosition) {
      if (this.userMarker) { // check
        this.map.removeLayer(this.userMarker); // remove
      }
      this.userMarker = L.marker(this.userPosition, {icon: iconUser} ).addTo(this.map);
      mapBounds.push(this.userPosition);
    }
    var markersLayer = []
    let center_markers = 10;
    for (var i = 0; i < markers.length; i++) {
      var marker_options = { container_pos: i, className: "ion-color-"+markers[i].class };
      if ( markers[i].hasOwnProperty('custom_icon') && markers[i].custom_icon != '' ) {
        marker_options['icon'] = L.icon({
          iconUrl: markers[i].custom_icon,
          iconSize: [37, 45],
          iconAnchor: [18.5, 45],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [60, 60]
        });
      }
      var newMarker = new L.CustomMarker([markers[i].latitude,markers[i].longitude], marker_options)
      .on('click', this.clickPin, this); //L.bind(this.showPane, null, markers[i]))
      if ( center_markers != 0 && fly ) {
        mapBounds.push([markers[i].latitude, markers[i].longitude]);
        center_markers = center_markers - 1;
      }
      markersLayer.push(newMarker);
    }
    this.markers = L.layerGroup(markersLayer).addTo(this.map);
    if ( mapBounds.length > 0 ) {
      if ( fly ) {
        this.currentBounds = mapBounds;
        this.flyToBounds(mapBounds);
      }
      return 1;
    }
    else {
      return 0;
    }
  }

  locatePosition() {
    this.map.locate({ setView: true }).on("locationfound", (e: any) => {
      if (this.userMarker) { // check
        this.map.removeLayer(this.userMarker); // remove
      }
      this.userMarker = L.marker([e.latitude, e.longitude], {
        draggable: true
      }).addTo(this.map);
      this.userMarker.bindPopup('Elegir esta ubicación').openPopup();
        //this.getAddress(e.latitude, e.longitude);
      this.userMarker.on("dragend", () => {
        let userPos = this.userMarker.getLatLng();
        this.setUserPosition( [ userPos[0], userPos[1] ] );
        //this.getAddress(position.lat, position.lng);
        //console.log(position.lat, position.lng);
      });
    });
  }
  drawRoute( start:[number, number], end:[number, number]) {
    return this.route = L.Routing.control({
      waypoints: [L.latLng(start), L.latLng(end)],
      createMarker: function(i: number, dStart: L.LatLng, n: number){ return null },
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints : false,
      Instruction: 'text',
      show: false, //for hidding routing itinerary
      router: L.Routing.mapbox('pk.eyJ1IjoiYm90dW0iLCJhIjoiY2s4anBoOHRzMGJ5dzNscDg1c2drMXBoNSJ9.vQ7qAGX7IMadmIfcCp7eRQ')
    }).addTo(this.map);
	}

  toggleAnimation() {
    this.animating = !this.animating;
  }
  getBoundingCoords() {
    let bounds = this.map.getBounds();
    let sw = bounds.getSouthWest();
    let ne = bounds.getNorthEast();
    return [sw.lat+','+sw.lng, ne.lat+','+ne.lng];
  }
  flytomarker(latlong: [number, number], zoom: number){
    this.animating = true;
    this.zoom = zoom;
    this.map.flyTo(latlong, zoom);
    this.map.once('moveend', this.toggleAnimation, this);
    // Coding for set bounds in pixel from top instead of center of map for cuppertino open.
    // var neLatLng = this.map.containerPointToLatLng([150, 200]);
    // console.log(neLatLng);
    // var newViewCenter = L.latLngBounds(neLatLng);
    // console.log(newViewCenter);
    // this.map.fitBounds(newViewCenter);

  }
  flyToBounds(mapBounds: [number, number][], options?: {}) {
    this.animating = true;
    this.map.flyToBounds(mapBounds, options);
    this.map.once('moveend', this.toggleAnimation, this);
  }
  //
  resizeMap(zoom?: number) {
    if ( zoom ){
      this.zoom = zoom;
    }
    this.map.invalidateSize();
    this.map.flyTo(this.center, this.zoom);
    //this.flyToBounds(this.currentBounds);
  }
  //PIN behavior
  clickPin(pin: any) {
    let pos = pin.target.options.container_pos;
    this.currentContainer = this.containers[pos];
    this._pinClick.next(true);
  }
  //Observable
  get pinClicked() {
    return this._pinClick.asObservable();
  }
  clickZone(zone) {
    this._zoneClick.next(zone);
  }
  //Observable
  get zoneClicked() {
    return this._zoneClick.asObservable();
  }
  zoomChange() {
    this.zoom = this.map.getZoom();
    this.mapChanges();
  }
  centerChange() {
    this.center = this.map.getCenter();
    this.mapChanges();
  }
  //MAP behavior
  mapChanges(){
    //Si no es una animación auto);
    if ( !this.animating && this.animating != undefined ) {
      this._mapChangeSub.next(true);
    }
  }
  get mapChanged() {
    return this._mapChangeSub.asObservable();
  }
  //Observable as function
  get autoSearch() :any {
    return this._autoSearch.asObservable();
  }
  //
  getBoundsWKT() {
    let bounds = this.map.getBounds();
    return "POLYGON(("
    + Object.values(bounds.getNorthWest()).reverse().join(' ') +","
    + Object.values(bounds.getSouthWest()).reverse().join(' ') +","
    + Object.values(bounds.getSouthEast()).reverse().join(' ') +","
    + Object.values(bounds.getNorthEast()).reverse().join(' ') +","
    + Object.values(bounds.getNorthWest()).reverse().join(' ') +"))";
  }
  //
  loadZones(layers: L.GeoJSON, zoom2zone = false, fixPosition = false) {
    const _this = this;
    var bounds = [];
    var zonesData = L.featureGroup();
    L.geoJSON(
      layers, {
        onEachFeature: function (feature, layer) {
          if (zoom2zone) {
            bounds.push(layer.getBounds());
          }
          layer.addTo(zonesData);
        }
      }
    );
    zonesData.addTo(this.map);
    this.zones = zonesData;
    if ( zoom2zone && bounds.length > 0 ) {
      bounds.push(this.userPosition);
      this.currentBounds = bounds;
      if ( fixPosition ) {
        this.flyToBounds( bounds, {paddingBottomRight: [0,400]} );
      }
      else {
        this.flyToBounds( bounds );
      }
    }
  }
  //
  removeZones() {
    if ( this.zones != undefined ) {
      this.map.removeLayer(this.zones);
    }
  }
  //
  showZones( zoom2zone: boolean, index?: number) {
    if ( this.zones != undefined ) {
        this.map.addLayer(this.zones);
      if (zoom2zone) {
        var zoneBounds = [];
        var sw = this.zones.getBounds().getSouthWest();
        var ne = this.zones.getBounds().getSouthWest();
        this.flyToBounds( [
          [ne.lat, ne.lng],
          [sw.lat, sw.lng],
          this.userPosition,
        ]);
      }
    }
  }
  showSubZone(layer: L.GeoJSON) {
    if (this.subZone) {
      this.map.removeLayer(this.subZone);
    }
    this.subZone = L.geoJSON( layer );
    this.subZone.addTo(this.map);
  }
  //Country selection
  selectCountry(country: string) {
    this.session.setCountry(country);
    this.removeUserPosition();
    this.center = L.latLng(environment[country].center);
    this.reRoute();
  }

  reRoute(){
    if ( !this.router.routerState.snapshot.url.startsWith('/mapa') || this.map == undefined ) {
      this.router.navigate([this.session.homeUrl]);
    }
    else {
      this.resizeMap(17);
    }
  }
  isMapPage() {
    if ( this.router.routerState.snapshot.url.startsWith('/intro/mapa') ) {
      return true;
    }
    return false;
  }
  async getUserPosition() {
    return this.storage.get("userPosition").then(
      (up) => {
        return this.userPosition = up;
      }
    );
  }
  setUserPosition(coords:[number, number]) {
    this.userPosition = [ coords[0], coords[1] ];
    this.storage.set("userPosition", this.userPosition);
  }
  removeUserPosition() {
    delete this.userPosition;
    this.storage.remove("userPosition");
  }
  //Create additional Control placeholders, to group all control buttons
  /*addControlPlaceholders(map: L.Map) {
   const corners = map._controlCorners;
   const l = 'leaflet-';
   const toolsPanel = map._controlContainer;
   function createCorner(vSide, hSide) {
       const className = l + vSide + ' ' + l + hSide;
       corners[vSide + hSide] = L.DomUtil.create('div', className, toolsPanel);
   }
   createCorner('verticalcenter', 'left');
 }*/
}
