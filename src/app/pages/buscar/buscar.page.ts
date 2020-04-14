import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ModalController, NavParams, IonSearchbar } from "@ionic/angular";
import { Router } from '@angular/router';
// import {
//   NativePageTransitions,
//   NativeTransitionOptions,
// } from "@ionic-native/native-page-transitions";
// import { RouterOutlet } from "@angular/router";

import { createAnimation } from '@ionic/core';

@Component({
  selector: "app-buscar",
  templateUrl: "./buscar.page.html",
  styleUrls: ["./buscar.page.scss"],
})
export class BuscarPage implements OnInit {
  @ViewChild("searchbar", { static: false }) private searchbar: IonSearchbar;

  constructor(
    ) {
      createAnimation()
      .addElement(document.querySelector('ion-searchbar'))
      .duration(3000)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, background: 'red' },
        { offset: 0.72, background: 'var(--background)' },
        { offset: 1, background: 'green' }
      ]);
    }

  ngAfterViewChecked() {
    this.searchbar.setFocus();
  }

  ngOnInit() {}
}
