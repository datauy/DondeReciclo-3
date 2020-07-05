import { Component, OnInit, ElementRef, QueryList } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ViewChild, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { SessionService } from 'src/app/services/session.service';
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

  constructor(
    public session: SessionService,
    public api: ApiService<any>,
  ) { }

  /*ionViewWillEnter(): void {
    for(let i of this.videos){
      i.url = this.domSanitizer.bypassSecurityTrustResourceUrl(i.vid_link);
    }
  }*/
  ngOnInit() {
    this.api.loadPrograms().subscribe( (programs: Program[]) =>  { // console.log(this.predefinedOptions)
      this.programs = programs;
    });
  }
}
