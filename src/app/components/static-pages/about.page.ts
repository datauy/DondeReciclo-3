import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./static-pages.scss'],
})
export class AboutPage implements OnInit {

  constructor(
    public session: SessionService,
  ) { }

  ngOnInit() {}

}
