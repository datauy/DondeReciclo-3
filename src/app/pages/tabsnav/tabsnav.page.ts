import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SessionService } from './../../services/session.service';

@Component({
  selector: 'app-tabsnav',
  templateUrl: './tabsnav.page.html',
  styleUrls: ['./tabsnav.page.scss'],
})
export class TabsnavPage implements OnInit {

  isLoading = true;

  constructor(
    private keyboard: Keyboard,
    public session: SessionService
  ) {
    if ( !this.session.get('showSlider') ) {
      this.session.set('showSlider', 'visible');
    }
  }

  showKeyboard() {
    this.keyboard.isVisible;
  }

  hideKeyboard() {
    this.keyboard.hide();
  }

	ngOnInit() {
	}

  // ionViewWillEnter() {
  //   setTimeout( () => {
  //     this.isLoading = false;

  //   }, 500);
  // }

}
