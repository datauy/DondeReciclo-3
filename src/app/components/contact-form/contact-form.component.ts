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

  register(form) {
    this.utils.openTicket(form.value).then((res) => {
      if (res) {
        this.success = true;
      }
      else {
        this.fail = true;
      }
    });
  }
}
