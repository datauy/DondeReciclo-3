import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Program } from "src/app/models/basic_models.model";
import { ApiService } from "src/app/services/api.service";
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.page.html',
  styleUrls: ['./programs.page.scss'],
})
export class ProgramsPage implements OnInit {

  @ViewChild('programSlider', {static: false}) slider: IonSlides;
  pid: number;
  programs: Program[];
  tags: {name:string, programs:Program[]};
  slideOpts = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };
  showCategories = true;

  constructor(
    public api: ApiService<any>,
    public session: SessionService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.pid = this.route.snapshot.params['programID'];
    //Reverse order if program has to be loaded
    if ( this.pid != undefined ) {
      this.api.loadPrograms().subscribe( (programs: Program[]) =>  {
        this.format_programs(programs);
        this.showProgram();
        this.api.loadTagsPrograms().subscribe( ( tags: {name:string, programs: Program[]} ) =>  {
          this.tags = tags;
        });
      });
    }
    else {
      this.api.loadTagsPrograms().subscribe( ( tags: {name:string, programs: Program[]} ) =>  {
        this.tags = tags;
        this.api.loadPrograms().subscribe( (programs: Program[]) =>  {
          this.programs = programs;
        });
      });
    }
  }
  //
  format_programs(programs: Program[]) {
    programs.forEach(program => {
      program.materials = program.materials_arr;
      program.sub_programs = program.sub_programs_arr;
      program.wastes = program.wastes_arr;
    });
    this.programs = programs;
  }
  //
  nextSlide() {
    this.slider.slideNext();
  }
  //
  prevSlide() {
    this.slider.slidePrev();
  }
  showProgram() {
    let index = this.programs.findIndex( p => p.id == this.pid );
    this.slider.slideTo(index);
    this.session.showBackButton = true;
    this.showCategories = false;
  }
  goBack() {
    this.showCategories = true;
  }
}
