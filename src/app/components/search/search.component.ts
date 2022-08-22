import { Component, Input } from '@angular/core';
//import { IonSearchbar, IonButton, IonBackdrop} from '@ionic/angular';
//import { createAnimation } from '@ionic/core';
//import { AutoCompleteOptions, AutoCompleteComponent } from 'ionic4-auto-complete';
import { ApiService } from "src/app/services/api.service";
import { MapService } from "src/app/services/map.service";

import { SearchItem, Dimension } from "src/app/models/basic_models.model";
import { SessionService } from 'src/app/services/session.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { environment } from 'src/environments/environment';

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
  isInit = true;
  environment = environment;
  predefinedSearch: Array<SearchItem> = [];
  dimensions: Array<Dimension> = [];
  showAllDimensions = true;
  not_filter_dimensions = ['item selected', 'dimension'];

  constructor(
    public api: ApiService,
    public map: MapService,
    public session: SessionService,
    public notification: NotificationsService,
    ) {
      this.map.autoSearch.subscribe(
        (sitem) => {
          if ( sitem != null ) {
            if ( typeof sitem === "object" ) {
              sitem.type = 'materials';
              this.itemSelected(sitem);
            }
            else {
              this.api.getWastes([sitem]).subscribe((wastes: any) => {
                wastes[0].type = 'wastes';
                this.itemSelected(wastes[0]);
              });
            }
          }
        }
      );
      this.session.countryChanged.subscribe(
        countryName => {
          this.predefinedArrange();
        }
      );
      this.api.initialDataLoaded.subscribe( (loaded) => {
        if ( loaded ) {
          this.session.searchDimensions = [];
          environment[this.session.country].dimensions.forEach(dim => {
            this.session.searchDimensions.push(dim.id);
          });
        }
      });
    }
  toggleSearch() {
    if ( this.searchVisibility == true ) {
      this.hideSearch('toggle');
    }
    else {
      this.showSearch(null);
      this.suggestVisibility = true;
    }
  }
  showSearch(event) {
    if( this.isInit ) {
      if ( this.session.country == 'Colombia' ) {
        this.search4address(true);
      }
      if ( !this.predefinedSearch.length ) {
        this.dimensions = environment[this.session.country].dimensions;
        this.predefinedArrange();
      }
      this.isInit = false;
    }
    this.searchVisibility = true;
    /*let clearButton = document.querySelector('.searchbar-clear-button') as HTMLElement;
    console.log(clearButton);
    clearButton.addEventListener("click", (event: Event) => this.hideSearch(event) );*/
  }

  hideSearch(event) {
    //filter dimensions if hidding from other sources
    if ( !this.not_filter_dimensions.includes(event) ) {
      this.dimensionsFilter();
    }
    this.suggestVisibility = false;
    this.searchVisibility = false;
  }

  dimensionSelected(dim) {
    let pos = this.session.searchDimensions.indexOf(dim);
    if ( pos !== -1 ) {
      //Prevent unselect all
      if ( this.session.searchDimensions.length > 1 ) {
        this.session.searchDimensions.splice(pos, 1);
      }
      else {
        return;
      }
    }
    else {
      this.session.searchDimensions.push(dim);
    }
    this.predefinedArrange();
  }
  //
  predefinedArrange() {
    let predefined = [];
    this.session.searchDimensions.forEach( dim => {
      predefined = predefined.concat(this.environment[this.session.country].predefinedSearch[dim].filter( (item) => !predefined.includes(item) ));
    });
    this.predefinedSearch = predefined.sort((a, b) => (a.name > b.name) ? 1 : -1);

    if ( this.environment[this.session.country].dimensions != undefined && this.session.searchDimensions.length != this.environment[this.session.country].dimensions.length ) {
      this.showAllDimensions = false;
    }
    else {
      this.showAllDimensions = true;
    }
  }
  dimensionsFilter() {
    if ( this.showAllDimensions ) {
      // Lo devolvemos al flujo normal
      if ( this.session.searchItem != undefined && this.session.searchItem.type == 'dimensions' ) {
        delete this.session.searchItem;
        this.map.mapChanges();
      }
    }
    else {
      let m_ids = []
      environment[this.session.country].dimensions.forEach( dim => {
        if ( this.session.searchDimensions.includes( dim.id ) ) {
          m_ids = m_ids.concat(dim.materials.filter( (item) => !m_ids.includes(item) ));
        }
      });
      console.log(new Dimension);

      let item = {
        id: 0,
        name: "Dimensiones",
        class: "dimensions",
        ids: m_ids.join(','),
        type: 'dimensions',
        deposition: '',
        icon: ''
      }
      let center = this.map.map.getCenter();
      let pos = [center.lat, center.lng];
      this.session.searchItem = item;
      this.api.getContainersByMaterials(item.type+"="+item.ids, pos)
      .subscribe((containers) => {
        this.map.loadMarkers(containers, true);
      });
    }
    this.session.showSearchItem = false;
    this.hideSearch('dimension');
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
              id: 'noSearch',
              type: 'notification',
              class: 'warnings',
              title: 'No hay resultados para: '+item.name,
              note: 'No hay contenedores a menos de 300 km. de su ubicación'
            };
            this.notification.showNotification(noRes);
          }
          this.session.searchItem = item;
          this.searchBarIonic.value = null;
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
  getItemLabel(value) {
    return '';
  }
  //
  closeSelection() {
    delete this.session.searchItem;
    if ( !this.showAllDimensions ) {
      this.dimensionsFilter();
    }
    else {
      this.session.showSearchItem = false;
      //reload pins
      this.map.mapChanges();
    }
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
      return this.api.getResults(str);
    }
  }

}
