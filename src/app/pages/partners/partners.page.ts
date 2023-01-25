import { Component, OnInit } from '@angular/core';

import { SessionService } from 'src/app/services/session.service';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.page.html',
  styleUrls: ['./partners.page.scss'],
  providers: [InAppBrowser]
})
export class PartnersPage implements OnInit {

  constructor(
    public session: SessionService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
  }
  goTo(link) {
    this.iab.create(link, '_system');
  }
}
