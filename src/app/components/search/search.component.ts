import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { IonSearchbar, IonButton, IonBackdrop} from '@ionic/angular';
import { createAnimation } from '@ionic/core';
import { AutoCompleteOptions } from 'ionic4-auto-complete';
import { ApiService } from "src/app/services/api.service";

import { SearchParams, Material } from "src/app/models/basic_models.model";

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


  public selected:string = '';

  constructor(
    public api: ApiService<any>
    ) {
      // this.options = new AutoCompleteOptions();
      // this.labelAttribute = 'name';
      // this.options.autocomplete = 'on';
      // this.options.debounce = 750;
      // this.options.placeholder = 'Buscá objetos o materiales';

    // createAnimation()
    // .addElement(document.querySelector('ion-searchbar'))
    // .duration(3000)
    // .iterations(Infinity)
    // .keyframes([
    //   { offset: 0, background: 'red' },
    //   { offset: 0.72, background: 'var(--background)' },
    //   { offset: 1, background: 'green' }
    // ]);
  }

  ngOnInit() {
    this.api.loadInitialData().subscribe(
      () =>  { this.predefinedOptions = this.api.predefinedSearch;
        // console.log(this.predefinedOptions)
      }
    );
  }

  // ionViewDidLoad() {
  //   this.searchBarElement.addEventListener('click', (e) => {
  //     console.log('Button clicked!');
  //   });
  //   // this.searchBar.ionFocus('click', (e: any) => {
  //   //   this.searchVisibility = true;
  //   //   console.log('click serarch');
  //   // });
  //   // console.log(this.backdrop);
  //   // this.backdrop.ionBackdropTap.subscribe((data) => {
  //   //     console.log('Data received', data);
  //   // });
  // }

  showSearch(event) {
    this.searchVisibility = true;
    this.api.suggestVisibility = true;
  }

  hideSearch(event) {
    this.api.suggestVisibility = false;
    this.searchVisibility = false;
  }
/*
  showSuggest(event){
    //this.suggestVisibility = true;
    console.log("suggest shown");
    console.log(event);
  }

  hideSuggest(event){
    // if (this.searchVisibility){
    //   this.searchVisibility = false;
    // }
    //  this.suggestVisibility = false;
      console.log("suggest hidden");
      console.log(event);
  }*/

  on(output, event):void {
    console.log("Search::OUTPUT");
    console.log(output);
    console.log(event);
  }

}
