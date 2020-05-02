import { Component, OnInit, ViewChild } from '@angular/core';
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

  // setFocusSearch() {
  //   this.searchbar.setFocus();
  // }
  
	ngOnInit() {
  }
  
  ngAfterViewChecked() {
    // this.skipSlides.addEventListener('click', (e: any) => {
    //   console.log("skip clicked");
    //   console.log(e);
    //   console.log(e.target);
    // });
  }

  ionViewDidEnter(){
    setTimeout( () => {
      this.isLoading = false;

    }, 500);
  }

}
