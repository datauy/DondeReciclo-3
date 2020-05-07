import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { IonSearchbar, IonButton, IonBackdrop} from '@ionic/angular';
import { createAnimation } from '@ionic/core';
import { AutoCompleteOptions } from 'ionic4-auto-complete';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild(IonSearchbar, { static: false }) private searchBar: IonSearchbar;

  backdrop = document.querySelector('custom-backdrop');
  nextSlideBtn = document.querySelector('#searchBar');
  showBackdrop = true;

  searchString: string;
  searchVisibility = true;

  // autocomplete component
  public options:AutoCompleteOptions;

  public selected:string = '';

  constructor(
    public provider:SearchService
    ) {
      this.options = new AutoCompleteOptions();

      this.options.autocomplete = 'on';
      this.options.debounce = 750;
      this.options.placeholder = 'Buscá objetos o materiales.';
      this.options.type = 'add-friend.svg';
      this.options.clearInvalidInput = false;

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

  ngOnInit() {}

  ionViewDidLoad() {
    this.nextSlideBtn.addEventListener('click', (e) => {
      console.log('Button clicked!');
    });
    // this.searchBar.ionFocus('click', (e: any) => {
    //   this.searchVisibility = true;
    //   console.log('click serarch');
    // });
    // console.log(this.backdrop);
    // this.backdrop.ionBackdropTap.subscribe((data) => {
    //     console.log('Data received', data);
    // });
  }
  searchAPI(string) {
    this.searchString = string;
  }

  showSearch() {
    this.showBackdrop = true;
    this.searchVisibility = true;
    console.log('click show search')
  }

  hideSearch() {
    // event.stopPropagation();
    // this.backdrop.ionBackdropTap;
    this.showBackdrop = false;
    this.searchVisibility = false;
    console.log('click hide search')
  }

  on(output, event):void {
    console.log(output);
    // console.log(event);
  }
}
