import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { IonSearchbar, IonButton, IonBackdrop} from '@ionic/angular';
import { createAnimation } from '@ionic/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild(IonButton, { static: false }) private skipSlides: IonButton;
  @ViewChild(IonSearchbar, { static: false }) private searchBar: IonSearchbar;
  backdrop = document.querySelector('custom-backdrop');
  nextSlideBtn = document.querySelector('#searchBar');
  showBackdrop = true;

  searchString: string;
  searchVisibility = true;

  constructor(
    ) {
    // createAnimation()
    // .addElement(document.querySelector('ion-searchbar'))
    // .duration(3000)
    // .iterations(Infinity)
    // .keyframes([
    //   { offset: 0, background: 'red' },
    //   { offset: 0.72, background: 'var(--background)' },
    //   { offset: 1, background: 'green' }
    // ]);
    // this.skipSlides.ionFocus('click', (e: any) => {
    //   this.searchBar.setFocus();
    // });
  }

  ngOnInit() {}

  ionViewDidLoad() {
    console.log('didload');
    this.nextSlideBtn.addEventListener('click', (e) => {
      console.log('Button clicked!');
    });
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
  }

  hideSearch() {
    // event.stopPropagation();
    // this.backdrop.ionBackdropTap;
    this.showBackdrop = false;
    this.searchVisibility = false;
    console.log('click')
  }
}
