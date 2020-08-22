import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-form',
  templateUrl: './forgot.form.html',
  styleUrls: ['./user.page.scss'],
})
export class ForgotForm implements OnInit {

  public success: boolean;
  public fail: boolean;

  constructor(
    public formBuilder: FormBuilder,
    private session: SessionService,
    private auth: AuthService,
  ) { }

  user_data: FormGroup;

  ngOnInit() {
    this.user_data = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
      ])),
    });
  }

  newpass() {
    console.log(this.user_data);
    if ( !this.user_data.value.email ) {
      return false;
    }
    this.session.isLoading = true;
    this.auth.requestToken( this.user_data.value ).subscribe(
      (res) => {
        this.session.isLoading = false;
        if (res) {
          this.success = true;
        }
        else {
          this.fail = true;
        }
      },
      () => {
        this.session.isLoading = false;
        this.fail = true;
      }
    );
  }
  clearResults() {
    delete this.success;
    delete this.fail;
  }
}
