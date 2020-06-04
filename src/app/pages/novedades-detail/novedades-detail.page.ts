import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-novedades-detail',
  templateUrl: './novedades-detail.page.html',
  styleUrls: ['./novedades-detail.page.scss'],
})
export class NovedadesDetailPage implements OnInit {

  constructor(
    public session: SessionService
  ) {
    this.session = session;
  }

  ngOnInit() {
    this.session.showBackButton = true;
    this.session.urlBackButton = "/novedades";
  }

}
