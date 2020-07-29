import { Component, OnInit } from '@angular/core';
import { UtilsService } from "src/app/services/utils.service";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

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
      neighbor: [''],
      age: [''],
      tc: [false, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  register() {
    this.utils.createUser(this.user_data.value).subscribe((res) => {
      console.log(res);
      if (res) {
        this.success = true;
      }
      else {
        this.fail = true;
      }
      setTimeout(() => {
        delete this.success;
        delete this.fail;
      }, 10000);
    });
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
}
