import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';

// import { Router } from "@angular/router";
// import { ViewChild } from '@angular/core';
// import { IonSlides } from '@ionic/angular';


export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit  {

  slides: Slide[];
  showSkip = true;


  // @ViewChild('slides', { static: true }) ionSlides: IonSlides;

  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  

  constructor(
    public menu: MenuController, 
    public navCtrl: NavController,
    private splashScreen: SplashScreen
  ) { 

    this.slides = [
      {
        title: "primera",
        description: "descripción",
        image: '/assets/img/ica-slidebox-img-1.png',
      },
      {
        title: "segunda",
        description: "descripción",
        image: '/assets/img/ica-slidebox-img-2.png',
      },
      {
        title: "tercera",
        description: "descripción",
        image: '/assets/img/ica-slidebox-img-3.png',
      }
    ];
    
  }

  goApp(){
    this.navCtrl.navigateForward('/tabsnav');
  }

  ionViewDidEnter() {
    // this.splashScreen.hide();

    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  // nextSlide() {
  //   this.ionSlides.slideNext();
  // }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ngOnInit() {
    this.splashScreen.show();
  }
}

