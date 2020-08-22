import { Component, OnInit } from '@angular/core';

import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.page.html',
  styleUrls: ['./partners.page.scss'],
})
export class PartnersPage implements OnInit {

  constructor(
    public session: SessionService
  ) { }

  ngOnInit() {
  }

}
