import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SessionService } from './../../services/session.service';

@Component({
  selector: 'app-tabsnav',
  templateUrl: './tabsnav.page.html',
  styleUrls: ['./tabsnav.page.scss'],
})
export class TabsnavPage implements OnInit{

  constructor(
    private keyboard: Keyboard,
    public session: SessionService
  ) {
  }
  
  showKeyboard() {
    this.keyboard.isVisible;
  }

  hideKeyboard() {
    this.keyboard.hide();
  }

	ngOnInit() {
    isLoading = true
	}

  ionViewWillEnter() {
    setTimeout( () => {
      this.isLoading = false;

    }, 2500);    
    console.log('isloading false')
  }

}
