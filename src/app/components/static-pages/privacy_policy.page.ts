import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-about',
  templateUrl: './privacy_policy.page.html',
  styleUrls: ['./static-pages.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  constructor(
    public session: SessionService,
  ) { }

  ngOnInit() {}

}
