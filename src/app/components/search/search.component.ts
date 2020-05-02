import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { IonSearchbar, IonButton } from "@ionic/angular";
import { createAnimation } from '@ionic/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent implements OnInit {
  @ViewChild(IonButton, { static: false }) private skipSlides: IonButton;
  @ViewChild(IonSearchbar, { static: false }) private searchBar: IonSearchbar;
  printToConsoleBtn  =  document.querySelector("#searchBar");
  // backdropDismiss = true;
  // showBackdrop = false;
  // shouldPropagate = false;

  searchString: string;
  
  constructor() { 

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

  ionViewDidLoad(){
   console.log('didload')
    this.printToConsoleBtn.addEventListener('click',(e)=>{
      console.log("Button clicked!");
    });
  }
  
  searchAPI(string) {
      this.searchString = string;
  }


}
