import { Component, OnInit } from '@angular/core';
import { UtilsService } from "src/app/services/utils.service";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  providers: [InAppBrowser]
})
export class ContactFormComponent implements OnInit {

  public success: boolean;
  public fail: boolean;

  constructor(
    public utils: UtilsService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public session: SessionService,
    private iab: InAppBrowser
  ) { }

  user_data: FormGroup;

  ngOnInit() {
    var sub = '';
    if ( this.route.snapshot.queryParams['subject'] ) {
      sub = this.route.snapshot.queryParams['subject'];
    }
    let fields = {
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
      ])),
      body: new FormControl('', Validators.required),
    }
    if ( this.session.country == 'Uruguay' ) {
      fields['subject'] = new FormControl(sub, Validators.required);
    }
    this.user_data = this.formBuilder.group(fields);
  }

  goTo(link) {
    this.iab.create(link, '_system');
  }
  register() {
    this.session.isLoading = true;
    this.user_data.value.country_id = environment[this.session.country].id
    if (this.user_data.value.subject == undefined ) {
      this.user_data.value.subject = 'Contacto ¿Donde Reciclo?';
    }
    this.utils.openTicket(this.user_data.value).subscribe((res) => {
      this.session.isLoading = false;
      if (res) {
        this.success = true;
      }
    });
    setTimeout(() => {
      if (!this.fail && !this.success) {
        this.session.isLoading = false;
        this.fail = true;
      }
    }, 10000);
  }
  retry() {
    this.fail = false;
  }
}
