import { Component, OnInit } from '@angular/core';

import { News } from "../../models/news.model";
import { ApiService } from "src/app/services/api.service";
import { SessionService } from "src/app/services/session.service";

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  news: News[];

  constructor(
    public api: ApiService<any>,
    public session: SessionService,
  ) { }

  ngOnInit() {
    if ( this.session.get('news') ) {
      this.news = Object.values( this.session.get('news') );
    }
    else {
      this.api.getNewsList(0).subscribe( (news: News[]) =>  {
        this.session.set('news', news);
        this.news = Object.values(news);
        //Load news in memory so we don't have to
      });
    }
  }
}
