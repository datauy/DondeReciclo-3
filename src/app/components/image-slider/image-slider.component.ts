import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { IonSlides } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent {

  @ViewChild('photoSlider', {static: false}) slider: IonSlides;

  slideOpts = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  constructor(
    public utils: UtilsService,
  ) { }

  ngOnInit() {
  }
  //
  nextSlide() {
    this.slider.slideNext();
  }
  //
  prevSlide() {
    this.slider.slidePrev();
  }
}
