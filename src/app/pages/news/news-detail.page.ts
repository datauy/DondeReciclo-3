import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { News } from "src/app/models/news.model";
import { ApiService } from "src/app/services/api.service";
import { SessionService } from "src/app/services/session.service";

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsDetailPage implements OnInit {

  article = {} as News;
  nid: number;

  constructor(
    private route: ActivatedRoute,
    public api: ApiService<any>,
    public session: SessionService,
  ) { }

  ngOnInit() {
    this.nid = this.route.snapshot.params['novedadID'];
    console.log('EN DETAILS -> ' + this.nid);
    if ( this.session.get('news') && this.session.get('news')[this.nid]) {
      var news = this.session.get('news');
      console.log("entra por hay news");
      this.article = news[this.nid];
      console.log(this.article);
      this.api.getNew(this.nid, false).subscribe( (art: News) =>  {
        this.article = {...news[this.nid], ...art};
      });
    }
    else {
      console.log("no hay news");
      this.api.getNew(this.nid, true).subscribe( (news: News) =>  {
        this.article = news;
        console.log(this.article);
      });
    }
    console.log(this.article);
  }
}
