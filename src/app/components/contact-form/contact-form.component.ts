import { Component, OnInit } from '@angular/core';
import { UtilsService } from "src/app/services/utils.service";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {

  public success: boolean;
  public fail: boolean;

  constructor(
    public utils: UtilsService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  user_data: FormGroup;

  ngOnInit() {
    var sub = '';
    if ( this.route.snapshot.queryParams['subject'] ) {
      sub = this.route.snapshot.queryParams['subject'];
    }
    this.user_data = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
      ])),
      subject: new FormControl(sub, Validators.required),
      body: new FormControl('', Validators.required),
    });
  }

  register() {
    console.log(this);
    this.utils.openTicket(this.user_data.value).subscribe((res) => {
      console.log(res);
      if (res) {
        this.success = true;
      }
      else {
        this.fail = true;
      }
    });
  }
}
