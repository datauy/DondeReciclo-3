import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams, Platform} from '@ionic/angular';


@Component({
  selector: 'app-modal-compartir',
  templateUrl: './modal-compartir.page.html',
  styleUrls: ['./modal-compartir.page.scss'],
})
export class ModalCompartirPage implements OnInit {

  modalTitle:string;
  modelId:number;
 
  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) { }
 
  ngOnInit() {
    // console.table(this.navParams);
    this.modelId = this.navParams.data.paramID;
    this.modalTitle = this.navParams.data.paramTitle;
  }
 
  async closeModal() {
    // const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss();
  }
}