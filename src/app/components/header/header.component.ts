import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { SocialShareComponent } from '../social-share/social-share.component';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
    public menuCtrl: MenuController,
    public modalController: ModalController,
    public session: SessionService,
  ) {
    this.session = session;
  }

  ngOnInit() {}

  toggleMenu() {
    this.menuCtrl.toggle(); //Add this method to your button click function
  }

  async showShareModal() {
    console.log('social share');
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: SocialShareComponent,
      cssClass: 'share-modal'
    });
    return await modal.present();
  }
}
