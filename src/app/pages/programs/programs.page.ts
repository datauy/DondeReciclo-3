import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { ApiService } from "src/app/services/api.service";
import { Program } from "src/app/models/basic_models.model";

@Component({
  selector: 'app-programs',
  templateUrl: './programs.page.html',
  styleUrls: ['./programs.page.scss'],
})
export class ProgramsPage implements OnInit {

  @ViewChild('programSlider', {static: false}) slider: IonSlides;

  programs: Program[];
  slideOpts = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  constructor(
    public api: ApiService<any>,
  ) { }

  ngOnInit() {
    this.api.loadPrograms().subscribe( (programs: Program[]) =>  { // console.log(this.predefinedOptions)
      this.programs = programs;
    });
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
