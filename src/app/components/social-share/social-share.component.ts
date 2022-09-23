import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SessionService } from "src/app/services/session.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent implements OnInit {

  @Input() shareURL: string;

  environment = environment;
  
  constructor(
  public modalController: ModalController,
  public session: SessionService
  ) { }

  ngOnInit() {}

  dismissShareModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
