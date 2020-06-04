import { Component, OnInit, Input } from '@angular/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { SocialShareComponent } from '../social-share/social-share.component';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input('title') title:any;
  @Input('display') display:any;
  @Input('backButton') backButton:any;
  @Input('backLink') backLink:any;

  constructor(
    public menuCtrl: MenuController,
    public modalController: ModalController,
    public session: SessionService,
    public navCtrl: NavController
  ) {
    this.session = session;
  }

  ngOnInit() {

  }

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
