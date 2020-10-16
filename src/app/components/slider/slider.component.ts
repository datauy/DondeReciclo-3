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
        title: "¡Ya diste el primer paso!",
        description: "Para empezar o mejorar tu clasificación y disposición de residuos reciclables, esta aplicación tiene toda la información necesaria.",
        image: '/assets/img/walkthrough-1.svg',
      },
      {
        title: "Clasificar mejor en casa",
        description: "Consejos para clasificar residuos en el hogar, para todos los residuos que puedan ser aprovechados, lo sean.",
        image: '/assets/img/walkthrough-2.svg',
      },
      {
        title: "¿Qué querrías introducir al ciclo de reciclaje?",
        description: "Con el buscador es posible encontrar dónde y de qué manera disponer tus residuos para ser reciclados.",
        image: '/assets/img/walkthrough-3.svg',
      },
      {
        title: "Información de otros temas de reciclaje",
        description: "Además de consejos para disponer residuos, ofrecemos información sobre residuos especiales, programas, noticias y mucho más.",
        image: '/assets/img/walkthrough-4.svg',
      }
    ];
  }

  goApp(permanent: boolean){
    if (permanent) {
      //Ahora todas van a permanente
    }
    this.session.watchSlider(false);
  }
  nextSlide() {
    this.slides.getActiveIndex().then(
      index => {
        if ( index == 3 ) {
          this.goApp(false);
        }
        else {
          this.slides.slideNext();
        }
      }
    );
  }
  prevSlide() {
    // console.log('GOING BACK');
    this.slides.slidePrev();
  }

  ngOnInit() {}

}
