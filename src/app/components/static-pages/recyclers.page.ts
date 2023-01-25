import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-recyclers',
  templateUrl: './recyclers.page.html',
  styleUrls: ['./static-pages.scss'],
  providers: [InAppBrowser]
})
export class RecyclersPage implements OnInit {

  constructor(
    public session: SessionService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {}

  goTo(link) {
    this.iab.create(link, '_system');
  }
}
