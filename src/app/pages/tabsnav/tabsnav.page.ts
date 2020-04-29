import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
// import { LoadingService } from 'src/app/services/loading.service';
// import { LoadingController } from '@ionic/angular';
// import { reduce } from 'rxjs/operators';

import { CommonService } from './../../services/common.service';


@Component({
  selector: 'app-tabsnav',
  templateUrl: './tabsnav.page.html',
  styleUrls: ['./tabsnav.page.scss'],
})
export class TabsnavPage implements OnInit{

  isLoading = true

  constructor(
    private keyboard: Keyboard,
    private common: CommonService,
    // private laodingService: LoadingService
  ) {
  }
  
  showKeyboard() {
    this.keyboard.isVisible;
  }

  hideKeyboard() {
    this.keyboard.hide();
  }

	ngOnInit() {
    // this.common.showLoading();
    // this.laoding.loadingPresent();
    // this.showLoader();
    // console.log('isloading: off');
	}

  ionViewWillEnter() {
    setTimeout( () => {
      this.isLoading = false;
      // this.common.hideLoading();

    }, 2500);    
    console.log('isloading false')
  }
  // async showLoader ()  {
  //   const loading = await this.loadingController.create({
  //     // spinner: null,
  //     duration: 3000,
  //     message: '<div class="loadingBody"></div><img src="assets/icon/loader.gif">',
  //     translucent: true,
  //     cssClass: 'custom-class custom-loading',
  //     backdropDismiss: false
  //   });
  //   await loading.present();

  //   const { role, data } = await loading.onDidDismiss();
  // }

  async ionViewDidLoad(){
    // this.laoding.loadingDismiss();

  }
}
