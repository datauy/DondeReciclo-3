import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit {

  trustedVideoUrl: SafeResourceUrl;
  videos = [{vid_link:"https://www.youtube-nocookie.com/embed/rGlIn4bM9DQ", url:null}];

  constructor(
    private domSanitizer: DomSanitizer,
    public session: SessionService
  ) { }

  /*ionViewWillEnter(): void {
    for(let i of this.videos){
      i.url = this.domSanitizer.bypassSecurityTrustResourceUrl(i.vid_link);
    }
  }*/
  ngOnInit() {
    for(let i of this.videos){
      i.url = this.domSanitizer.bypassSecurityTrustResourceUrl(i.vid_link);
    }
  }
}
