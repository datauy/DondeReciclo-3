import { Component, OnInit, ElementRef, QueryList } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ViewChild, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';

import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit {

  @ViewChild('cards', {static: false}) slider: IonSlides;
  @ViewChildren('cards', { read: ElementRef }) slides: QueryList<any>;
  trustedVideoUrl: SafeResourceUrl;
  videos = [{vid_link:"https://www.youtube-nocookie.com/embed/rGlIn4bM9DQ", url:null}];

  constructor(
    private domSanitizer: DomSanitizer,
    public session: SessionService,
    private element: ElementRef
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
  slideChanging() {
    this.slider.getActiveIndex().then(
      index => {
        this.changeBulletColor(index);
      }
    );
  }
  private changeBulletColor(index: number) {
    let bullets = this.element.nativeElement.querySelectorAll('.swiper-pagination-bullet');
    for (let i in bullets) {
      if ( bullets[i].nodeName == "SPAN" ) {
        bullets[i].style.removeProperty('background-color');
      }
    }
    let slide = this.slides.first.nativeElement.children[0].children[index];
    let bulletActive = this.element.nativeElement.querySelector('.swiper-pagination-bullet-active');
    bulletActive.style.backgroundColor = getComputedStyle(slide).getPropertyValue('--ion-color-base');
  }
}
