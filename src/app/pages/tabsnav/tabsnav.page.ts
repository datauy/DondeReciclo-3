import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SessionService } from './../../services/session.service';
import { environment } from '../../../environments/environment';
import { IonNav, IonTabs } from '@ionic/angular';
import { AutoCompleteComponent } from 'ionic4-auto-complete';

@Component({
  selector: 'app-tabsnav',
  templateUrl: './tabsnav.page.html',
  styleUrls: ['./tabsnav.page.scss'],
})
export class TabsnavPage implements OnInit {


  isLoading = true;
  showingKeyboard = false;

  tabsPage: any = false;

  @ViewChild("tabsNav", {
    static: false
  }) tabsNav: IonTabs;



  constructor(
    private keyboard: Keyboard,
    public session: SessionService
  ) {
    if (environment.production) {
      this.showingKeyboard = this.keyboard.isVisible;
      console.log('production');
    }else{
      console.log('develop');
      this.showingKeyboard = false;
    }
  }

  ngOnInit() {
    //Set slider value
    this.session.isShowSlider().then((toShow) => {
      this.session.watchSlider(toShow);
    });
  }

}
