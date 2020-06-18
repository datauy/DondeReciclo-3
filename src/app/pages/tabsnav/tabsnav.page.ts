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
export class TabsnavPage implements AfterViewInit {


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
    if (!this.session.get('showSlider')) {
      this.session.set('showSlider', 'visible');
    }

    if (environment.production) {
      this.showingKeyboard = this.keyboard.isVisible;
      console.log('production');
    }else{
      console.log('develop');
      this.showingKeyboard = false;
    }
  }

  // setFocusSearch() {
  //   this.searchbar.setFocus();
  // }

  ngAfterViewInit(){
    // console.log(this.tabsNav);
    // this.tabsNav.ionTabsDidChange.subscribe(async ev => {
    //   console.log("cambio tab: ", ev);
    //   this.tabsPage = await this.tabsNav.getSelected();
    //   if (this.tabsPage == "mapa"){
    //     this.searchBar.classList.add('show');
    //   }
    // })
  }

  // ionViewWillEnter(){
  //   this.session.breakPoint = "header-none";
  // }
  ngAfterViewChecked() {
    // this.skipSlides.addEventListener('click', (e: any) => {
    //   console.log("skip clicked");
    //   console.log(e);
    //   console.log(e.target);
    // });
  }

  // ionViewDidEnter() {
  //   setTimeout(() => {
  //     this.session.set('isLoading', 'false');
  //     this.isLoading = false;
  //     console.log("isloading: ", this.isLoading);
  //   }, 1000);
  // }

}
