import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login.form.html',
  styleUrls: ['./user.page.scss'],
})
export class LoginForm implements OnInit {

  public success: boolean;
  public fail: boolean;

  constructor(
    public formBuilder: FormBuilder,
    private session: SessionService,
    private auth: AuthService,
    private router: Router
  ) { }

  user_data: FormGroup;

  ngOnInit() {
    this.user_data = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
      ])),
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if ( !this.user_data.value.email || !this.user_data.value.email ) {
      return false;
    }
    this.session.isLoading = true;
    this.auth.loginUser(this.user_data.value.email, this.user_data.value.password ).subscribe((res) => {
      this.session.isLoading = false;
      if (res) {
        this.router.navigate(['/intro/mapa']);
      }
      else {
        this.fail = true;
      }
    });
  }
}
