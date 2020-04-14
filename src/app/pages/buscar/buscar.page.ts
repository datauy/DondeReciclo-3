import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ModalController, NavParams, IonSearchbar } from "@ionic/angular";
import { Router } from '@angular/router';
// import {
//   NativePageTransitions,
//   NativeTransitionOptions,
// } from "@ionic-native/native-page-transitions";
// import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-buscar",
  templateUrl: "./buscar.page.html",
  styleUrls: ["./buscar.page.scss"],
})
export class BuscarPage implements OnInit {
  @ViewChild("searchbar", { static: false }) private searchbar: IonSearchbar;

  constructor(
    ) {}

  ngAfterViewChecked() {
    this.searchbar.setFocus();
  }

  ngOnInit() {}
}
