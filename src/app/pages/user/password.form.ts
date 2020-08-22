import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-password-form',
  templateUrl: './password.form.html',
  styleUrls: ['./user.page.scss'],
})
export class PasswordForm implements OnInit {

  public success: boolean;
  public fail: boolean;
  showPass = false;

  constructor(
    public formBuilder: FormBuilder,
    private session: SessionService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  user_data: FormGroup;
  //
  ngOnInit() {
    this.user_data = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required),
    }, {
      validator: [
        this.mustMatch('password', 'confirmPassword')
      ]
    });
  }
  //
  newpass() {
    this.session.isLoading = true;
    console.log(this.user_data.value.password);
    let token = this.route.snapshot.params['token'];
    this.auth.sendPass( {password: this.user_data.value.password, token: token} ).subscribe((res) => {
      this.session.isLoading = false;
      if (res) {
        this.success = true;
      }
      else {
        this.fail = true;
      }
    });
    setTimeout(() => {
      if (!this.fail && !this.success) {
        this.session.isLoading = false;
        this.fail = true;
      }
    }, 10000);
  }
  //
  clearResults() {
    delete this.success;
    delete this.fail;
  }
  //
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }
  //
  togglePass() {
   this.showPass = !this.showPass;
  }
}
