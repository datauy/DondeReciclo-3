import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { SessionService } from 'src/app/services/session.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-consejos',
  templateUrl: './consejos.page.html',
  styleUrls: ['./consejos.page.scss'],
  providers: [InAppBrowser]
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
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
  }
  nextSlide() {
    this.slider.slideNext();
  }
  prevSlide() {
    this.slider.slidePrev();
  }
  goTo(link) {
    this.iab.create(link, '_system');
  }
}
