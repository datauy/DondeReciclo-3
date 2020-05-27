import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { IonSearchbar, IonButton, IonBackdrop} from '@ionic/angular';
import { createAnimation } from '@ionic/core';
import { AutoCompleteOptions } from 'ionic4-auto-complete';
import { ApiService } from "src/app/services/api.service";
import { MapService } from "src/app/services/map.service";

import { SearchParams, Material } from "src/app/models/basic_models.model";
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild(IonSearchbar, { static: false }) private searchBar: IonSearchbar;

  backdrop = document.querySelector('custom-backdrop');
  searchBarElement = document.querySelector('#searchBar');

  showBackdrop = false;
  searchVisibility = false;

  searchString: string;

  predefinedOptions: any[];

  // loading
  // isLoading: boolean;

  public selected:string = '';

  constructor(
    public api: ApiService,
    public map: MapService,
    public session: SessionService
    ) {
      this.session = session;
  }

  ngOnInit() {
    this.api.loadInitialData().subscribe(
      () =>  { this.predefinedOptions = this.api.predefinedSearch;
      console.log(this.predefinedOptions);
      }
    );
  }


  showSearch(event) {
    this.searchVisibility = true;
  }

  hideSearch(event) {
    this.api.suggestVisibility = false;
    this.searchVisibility = false;
  }

  searchSuggestion(id){

    console.log(this.predefinedOptions);
  }

  itemSelected(item) {
    console.log('item: ', item);
    let pos = null;
    this.session.isLoading = true;
    if (this.map.userPosition) {
      pos = this.api.getContainersByMaterials([item.material_id], this.map.userPosition);
    }
    this.api.getContainersByMaterials([item.material_id], pos).subscribe(
        (containers) => {
          if (this.map.loadMarkers(containers) == 0){
            console.log('no markers!');
          }
          this.hideSearch('item selected');
          setTimeout( () => {
            this.session.isLoading = false;
          }, 500);
        }
    );
  }


}
