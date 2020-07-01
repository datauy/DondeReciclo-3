import { Component, OnInit } from '@angular/core';
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {

  public success: boolean;
  public fail: boolean;

  constructor(
    public utils: UtilsService
  ) { }

  ngOnInit() {

  }

  register() {
    this.utils.openTicket('lala').then((res) => {
      if (res) {
        this.success = true;
      }
      else {
        this.fail = true;
      }
    });
  }
}
