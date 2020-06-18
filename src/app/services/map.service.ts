import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Container } from "src/app/models/container.model";

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
   id="dr-marker"
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
  iconAnchor: [25, 50],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = iconDefault;

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

  constructor() {
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
      if (this.route) {
        this.route.spliceWaypoints(0, 1, e.latlng);
      }
    });
  }

  loadMarkers( markers: Container[], center?:[number,number] ){
    this.containers = markers;
    let mapBounds = [];
    if (this.userPosition) {
      mapBounds.push(this.userPosition);
    }
    for (var i = 0; i < markers.length; i++) {
      new L.marker([markers[i].latitude,markers[i].longitude], {container_pos: i})
      .on('click', this.clickPin, this) //L.bind(this.showPane, null, markers[i]))
      .addTo(this.map);
      mapBounds.push([markers[i].latitude, markers[i].longitude]);
    }
    if (markers.length > 0){
      this.map.flyToBounds(mapBounds);
      return 1;
    }else{
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
      console.log(e.latitude, e.longitude);
      this.userMarker.on("dragend", () => {
        let userPos = this.userMarker.getLatLng();
        this.userPosition = [ userPos[0], userPos[1] ] ;
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

  flytomarker(){
    this.map.flyTo([this.currentContainer.latitude, this.currentContainer.longitude], 15);
    // Coding for set bounds in pixel from top instead of center of map for cuppertino open.
    // var neLatLng = this.map.containerPointToLatLng([150, 200]);
    // console.log(neLatLng);
    // var newViewCenter = L.latLngBounds(neLatLng);
    // console.log(newViewCenter);
    // this.map.fitBounds(newViewCenter);

  }
  clickPin(pin: any) {
    console.log("Executed by Service aaaahhhhhhhhh");
    let pos = pin.target.options.container_pos;
    this.currentContainer = this.containers[pos];
    console.log(this.currentContainer.latitude, this.currentContainer.longitude);
    this._pinClick.next(true);
  }
  //Experimental Observable
  get pinClicked() {
    return this._pinClick.asObservable();
  }
  private _pinClick = new BehaviorSubject<boolean>(false)
}
