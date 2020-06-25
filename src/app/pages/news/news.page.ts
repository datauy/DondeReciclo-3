import { Component, OnInit } from '@angular/core';

import { Novedad } from "../../models/novedad.model";

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  novedad = {} as Novedad;
  novedades: Novedad[];

  constructor() { }

  ngOnInit() {
    console.log('EN NEWS :()'); 
  }

}
