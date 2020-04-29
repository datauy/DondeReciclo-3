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
    window.addEventListener('keyboardWillShow', () => {
      console.log("Keyboard will Show");
    });
    window.addEventListener('keyboardDidShow', () => {
      console.log("Keyboard is Shown");
    });
    window.addEventListener('keyboardWillHide', () => {
      console.log("Keyboard will Hide");
    });
    window.addEventListener('keyboardDidHide', () => {
      console.log("Keyboard is Hidden");
    });
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

}
