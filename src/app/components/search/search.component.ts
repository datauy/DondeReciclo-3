import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { IonSearchbar, IonButton, IonBackdrop} from '@ionic/angular';
import { createAnimation } from '@ionic/core';
import { AutoCompleteOptions, AutoCompleteComponent } from 'ionic4-auto-complete';
import { ApiService } from "src/app/services/api.service";
import { MapService } from "src/app/services/map.service";

import { SearchParams, Material } from "src/app/models/basic_models.model";
import { SessionService } from 'src/app/services/session.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
//@ViewChild("searchbar", { static: false }) private searchBarAuto: AutoCompleteComponent;
  // @ViewChild(".searchbar-input", { static: false }) private searchBarIonic: HTMLInputElement;

  backdrop = document.querySelector('custom-backdrop');
  searchBarIonic: HTMLInputElement;
  // searchBarIonic: unknown;
  showBackdrop = false;
  searchVisibility = false;
  suggestVisibility: boolean;
  searchString: string;
  searchAddress = false;

  constructor(
    public api: ApiService,
    public map: MapService,
    public session: SessionService,
    public notification: NotificationsService
    ) {
      this.session = session;
      if ( this.session.country == 'Colombia' ) {
        this.search4address(true);
      }
  }

  showSearch(event) {
    this.searchVisibility = true;
    /*let clearButton = document.querySelector('.searchbar-clear-button') as HTMLElement;
    console.log(clearButton);
    clearButton.addEventListener("click", (event: Event) => this.hideSearch(event) );*/
  }

  hideSearch(event) {
    this.suggestVisibility = false;
    this.searchVisibility = false;
  }

  searchSuggestion(predefined){
    this.itemSelected(predefined);
  }

  itemSelected(item) {
    this.searchBarIonic = document.querySelector('.searchbar-input');
    if (item.class == 'address' ) {
      this.map.userPosition = [item.latlng.lat, item.latlng.lng];
      //this.map.flyToBounds();
      this.api.getNearbyContainers(2, this.map.userPosition)
      .subscribe((containers) => {
          this.map.loadMarkers(containers, true);
      });
      setTimeout( () => {
        this.searchBarIonic.value = '';
        this.hideSearch('item selected');
      }, 200);
    }
    else {
      this.session.isLoading = true;
      let pos = null;
      this.session.showSearchItem = true;
      if (this.map.userPosition) {
        pos = this.map.userPosition;
      }
      else {
        let center = this.map.map.getCenter();
        pos = [center.lat, center.lng];
      }
      this.api.getContainersByMaterials(item.type+"="+item.id, pos).subscribe(
        (containers) => {
          if (this.map.loadMarkers(containers, true) == 0){
            let noRes = {
              id: null,
              type: 'notification',
              class: 'warnings',
              title: 'No hay resultados para: '+item.name,
              note: 'No hay contenedores a menos de 300 km. de su ubicación'
            };
            this.notification.showNotification(noRes);
          }
          this.session.searchItem = item;
          this.searchBarIonic.value = '';
          this.hideSearch('item selected');
          setTimeout( () => {
            this.session.isLoading = false;
          }, 500);
          //Show search
        }
      );
    }
  }
  //
  closeSelection() {
    delete this.session.searchItem;
    //reload pins
    this.map.mapChanges();
  }
  //Selector between materials and addresses
  search4address(isit: boolean) {
    this.searchAddress = isit;
    this.suggestVisibility = !isit;
  }
  //results
  getResults(str: string){
    if ( this.searchAddress ) {
      if ( str != undefined && str.length >= 3 ) {
        return this.api.getAddressLocation(str);
      }
      else {
        return false;
      }
    }
    else {
      if ( str != undefined && str.length >= 3 && ( this.session.searchItem == undefined || str != this.session.searchItem.name ) ) {
        this.suggestVisibility = false;
      }
      else {
        this.suggestVisibility = true;
        return false;
      }
      return this.api.getResults(str).subscribe(
        (res) => {
          if (!res) {
            this.suggestVisibility = true;
          }
        }
      );
    }
  }

}
