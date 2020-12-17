import { Component, OnInit } from '@angular/core';
//import { IonInfiniteScroll } from '@ionic/angular';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { News } from "src/app/models/news.model";
import { ApiService } from "src/app/services/api.service";
import { SessionService } from "src/app/services/session.service";

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  news: News[];
  page = 0;

  constructor(
    public api: ApiService<any>,
    public session: SessionService,
  ) { }

  ngOnInit() {
    this.getPage().subscribe();
  }

  loadNews(event) {
    this.getPage().subscribe(
      (res) => {
        event.target.complete();
        //if (!res) {
          //// TODO: Verificar que no hay que hacer nada en caso de que no hayan más resultados.
        //}
      }
    );
  }

  getPage() {
    return this.api.getNewsList(this.page, environment[this.session.country].id ).pipe(map(
      (news: any) =>  {
        if ( Object.keys(news).length > 0 ) {
          if ( this.session.news == undefined ) {
            this.session.news = news;
          }
          else {
            this.session.news = {...this.session.news, ...news};
          }
          this.news = Object.values(this.session.news).reverse();
          if ( Object.keys(news).length < 5 ) {
            return false;
          }
          this.page++;
          return true;
        }
        else {
          return false;
        }
      }
    ));
  }

}
