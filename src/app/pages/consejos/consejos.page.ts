import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-consejos',
  templateUrl: './consejos.page.html',
  styleUrls: ['./consejos.page.scss'],
})
export class ConsejosPage implements OnInit {
  @ViewChild('advise', {static: false}) slider: IonSlides;

  slideOpts = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  constructor(
    public session: SessionService,
  ) { }

  ngOnInit() {
  }
  nextSlide() {
    this.slider.slideNext();
  }
  prevSlide() {
    this.slider.slidePrev();
  }
}
