import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-recyclers',
  templateUrl: './recyclers.page.html',
  styleUrls: ['./static-pages.scss'],
})
export class RecyclersPage implements OnInit {

  constructor(
    public session: SessionService,
  ) { }

  ngOnInit() {}

}
