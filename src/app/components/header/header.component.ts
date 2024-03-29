import { Component, OnInit, Input } from '@angular/core';
import { MenuController, ModalController} from '@ionic/angular';
import { Location } from "@angular/common";
import { SocialShareComponent } from '../social-share/social-share.component';

import { MapService } from "src/app/services/map.service";

import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/services/session.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [InAppBrowser]
})
export class HeaderComponent {
  @Input('title') title: any;
  @Input('display') display: any;
  @Input('backButton') backButton: boolean;
  @Input('backLink') backLink: any;

  environment = environment;

  constructor(
    public menuCtrl: MenuController,
    public modalController: ModalController,
    public session: SessionService,
    private location: Location,
    private map: MapService,
    private iab: InAppBrowser
  ) {
  }
  goTo(link) {
    this.iab.create(link, '_system');
  }
  //
  goBack(){
    /*if (this.backLink){
      this.navCtrl.navigateBack(this.backLink);
    }
    else{
      this.navCtrl.pop();
    }*/
    this.session.showBackButton = false
    this.location.back();
  }

  toggleMenu() {
    this.menuCtrl.toggle(); //Add this method to your button click function
  }

  async showShareModal() {
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: SocialShareComponent,
      cssClass: 'share-modal'
    });
    return await modal.present();
  }
}
