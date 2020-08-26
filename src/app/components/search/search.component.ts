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
export class SearchComponent implements OnInit {
//@ViewChild("searchbar", { static: false }) private searchBarAuto: AutoCompleteComponent;
  // @ViewChild(".searchbar-input", { static: false }) private searchBarIonic: HTMLInputElement;

  backdrop = document.querySelector('custom-backdrop');
  searchBarIonic: HTMLInputElement;
  // searchBarIonic: unknown;
  showBackdrop = false;
  searchVisibility = false;
  searchString: string;
  predefinedOptions: any[];

  public selected:string = '';

  constructor(
    public api: ApiService,
    public map: MapService,
    public session: SessionService,
    public notification: NotificationsService
    ) {
      this.session = session;
  }

  ngOnInit() {
    this.api.loadInitialData().subscribe(
      () =>  {
        this.predefinedOptions = this.api.predefinedSearch;
      }
    );
  }
  showSearch(event) {
    this.searchVisibility = true;
    /*let clearButton = document.querySelector('.searchbar-clear-button') as HTMLElement;
    console.log(clearButton);
    clearButton.addEventListener("click", (event: Event) => this.hideSearch(event) );*/
  }

  hideSearch(event) {
    this.api.suggestVisibility = false;
    this.searchVisibility = false;
  }

  showSuggestions(event) {
    this.api.suggestVisibility = true;
  }

  searchSuggestion(predefined){
    this.itemSelected(predefined);
  }

  itemSelected(item) {
    this.session.isLoading = true;
    let pos = null;
    this.session.showSearchItem = true;
    if (this.map.userPosition) {
      pos = this.map.userPosition;
    }
    this.searchBarIonic = document.querySelector('.searchbar-input');
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
        this.hideSearch('item selected');
        this.searchBarIonic.value = '';
        setTimeout( () => {
          this.session.isLoading = false;
        }, 500);
        //Show search
      }
    );
  }
  closeSelection() {
    delete this.session.searchItem;
    //reload pins
    this.map.mapChanges();
  }
//getSelection()

}
