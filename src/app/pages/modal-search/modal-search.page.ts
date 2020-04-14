import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ModalController, NavParams, IonSearchbar} from '@ionic/angular';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.page.html',
  styleUrls: ['./modal-search.page.scss'],
})
export class ModalSearchPage {
  @ViewChild("searchbarInModal", {static: false}) private searchbarInModal: IonSearchbar;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) {
    this.modalController = modalController;
  }

  ngAfterViewChecked() {
    // console.log(this.searchbarInModal)
    this.searchbarInModal.setFocus()
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
