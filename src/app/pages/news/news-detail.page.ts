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
    if ( this.session.get('news') && this.session.get('news')[this.nid]) {
      var news = this.session.get('news');
      this.article = news[this.nid];
      this.api.getNew(this.nid, false).subscribe( (art: News) =>  {
        this.article = {...news[this.nid], ...art};
      });
    }
    else {
      this.api.getNew(this.nid, true).subscribe( (news: News) =>  {
        this.article = news;
      });
    }
  }
}
