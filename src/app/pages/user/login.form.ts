import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login.form.html',
  styleUrls: ['./user.page.scss'],
})
export class LoginForm implements OnInit {

  public success: boolean;
  public fail: boolean;
  showPass = false;

  constructor(
    public formBuilder: FormBuilder,
    private session: SessionService,
    private auth: AuthService,
    private navCtl: NavController,
    private route: ActivatedRoute,
  ) { }

  user_data: FormGroup;

  ngOnInit() {
    if ( this.auth.isLogged ) {
      this.navCtl.navigateBack('/usuario/perfil');
    }
    else {
      this.user_data = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
        ])),
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }
  }

  login() {
    if ( !this.user_data.value.email || !this.user_data.value.password ) {
      return false;
    }
    this.session.isLoading = true;
    this.auth.loginUser(this.user_data.value.email, this.user_data.value.password ).subscribe(
      (res) => {
        this.session.isLoading = false;
        if (res) {
          if (this.route.snapshot.queryParams['intro']) {
            this.navCtl.navigateBack('/intro/mapa');
          }
          else {
            this.navCtl.back();
          }
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
  //
  togglePass() {
   this.showPass = !this.showPass;
  }
}
