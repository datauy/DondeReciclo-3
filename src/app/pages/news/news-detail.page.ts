import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Novedad } from "../../models/novedad.model";

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsDetailPage implements OnInit {

  novedad = {} as Novedad;
  nid: number;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nid = params['novedadID'];
    });
    console.log('EN DETAILS ->'+ this.nid);
  }

}
