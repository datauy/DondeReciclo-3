import { Component, OnInit } from '@angular/core';
import { UtilsService } from "src/app/services/utils.service";
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register.form.html',
  styleUrls: ['./user.page.scss'],
})
export class RegisterForm implements OnInit {

  public success: boolean;
  public fail: boolean;

  constructor(
    public utils: UtilsService,
    public formBuilder: FormBuilder,
    private session: SessionService,
    private auth: AuthService
  ) { }

  user_data: FormGroup;

  ngOnInit() {
    this.user_data = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
      ])),
      sex: ['', Validators.required],
      state: ['', Validators.required],
      neighborhood: [''],
      age: [''],
      tc: [undefined, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: [
        this.mustMatch('password',
        'confirmPassword'), this.checkTC
      ]
    });
  }

  register() {
    this.session.isLoading = true;
    this.auth.createUser( {user: this.user_data.value} ).subscribe((res) => {
      this.session.isLoading = false;
      if (res) {
        this.auth.loginUser(this.user_data.value.email, this.user_data.value.password ).subscribe((res) => {
          this.session.isLoading = false;
          if (res) {
            this.success = true;
          }
          else {
            this.fail = true;
          }
        });
      }
      else {
        this.session.isLoading = false;
        this.fail = true;
      }
      setTimeout(() => {
        delete this.success;
        delete this.fail;
      }, 10000);
    });
    setTimeout(() => {
      this.session.isLoading = false;
      this.fail = true;
    }, 10000);
  }
  clearResults() {
    delete this.success;
    delete this.fail;
  }
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
  public checkTC(c: AbstractControl){
    if(c.get('tc').value == false){
      return false;
    }
    return true;
  }
}
