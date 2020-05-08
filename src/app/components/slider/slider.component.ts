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
        description: "Si querés empezar o mejorar tu clasificación y disposición de residuos reciclables, esta app tiene toda la información que necesitás.",
        image: '/assets/img/mahakal.jpg',
      },
      {
        title: "Clasificá mejor en casa",
        description: "Consejos para clasificar de forma básica, intermedia y avanzada, para todos los residuos que puedan ser reciclados, lo sean.",
        image: '/assets/img/mahakal.jpg',
      },
      {
        title: "¿Qué querés reciclar?",
        description: "Usá el buscador para encontrar dónde y de qué manera disponer tus residuos para ser reciclados.",
        image: '/assets/img/mahakal.jpg',
      },
      {
        title: "Encontrá, informate, tirá.",
        description: "Además de encontrar dónde tirar, tenés información sobre los residuos que recibe y los que no, horarios, programas y mucho más.",
        image: '/assets/img/mahakal.jpg',
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
    // console.log("GOING NEXT");
    this.slides.slideNext();
  }
  prevSlide() {
    // console.log('GOING BACK');
    this.slides.slidePrev();
  }

  ngOnInit() {}

}
