import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { SessionService } from './../../services/session.service';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  homeSlides = []
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  @ViewChild(IonSlides, {static: false}) slides: IonSlides;


  constructor(
    public session: SessionService
  ) {
    this.homeSlides = [
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
    if ( !this.session.get('showSlider') ) {
      this.session.set('showSlider', 'visible');
    }
  }

  goApp(){
    this.session.set('showSlider', '0');
  }
  nextSlide() {
    console.log("GOING NEXT");
    this.slides.slideNext();
  }
  prevSlide() {
    console.log('GOING BACK');
    this.slides.slidePrev();
  }

  ngOnInit() {}

}
