import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Observable, BehaviorSubject } from 'rxjs';

import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService, Message } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register.form.html',
  styleUrls: ['./user.page.scss'],
})
export class RegisterForm implements OnInit {

  showPass: boolean;
  disabled: boolean = false;
  title: string;
  submitMessage: string = 'Enviar';
  userName: string;
  full: boolean = true;
  _formLoaded = new BehaviorSubject<boolean>(false);
  infoMessage: Message;
  errorMessage: Message;

  constructor(
    private formBuilder: FormBuilder,
    private session: SessionService,
    private auth: AuthService,
    public navCtrl: NavController,
    private notify: NotificationsService
  ) { }

  user_data: FormGroup;

  ngOnInit() {
    var predefined = {
      name: '',
      email: '',
      sex: '',
      state: '',
      neighborhood: '',
      age: null,
    };
    if ( this.auth.isLogged ){
      this.title = 'Perfil';
      this.auth.loadUserData().then(
        (user) => {
          console.log(user);
          this.disabled = true;
          predefined = {
          name: user.name,
          email: user.email,
          sex: user.sex,
          state: user.state,
          neighborhood: user.neighborhood,
          age: user.age,
          };
          this.userName = user.name;
          this.loadForm(predefined, true);
        }, (err) => {
          console.log('Error');
          console.log(predefined);
          this.loadForm(predefined);
          // Handle error
          console.log(err);
        }
      );
    }
    else {
      this.title = 'Crear cuenta';
      this.loadForm(predefined);
    }
  }

  editProfile() {
    if ( this.disabled ) {
      this.user_data.enable();
      this.title = 'Editar Perfil';
      this.submitMessage = 'Guardar cambios';
    }
    else {
      this.user_data.disable();
      this.title = 'Perfil';
      this.submitMessage = 'Guardar cambios';
    }
    this.disabled = !this.disabled;
  }
  //Observable as function
  get formLoaded() {
    return this._formLoaded;
  }
  //Load user form
  loadForm( predefined, partial:boolean = false ) {
    let fields = {};
    let options = {};
    let pfields = {
      //name: [{value: predefined.name, disabled: this.disabled}, Validators.required],
      name: [predefined.name, Validators.required],
      email: [predefined.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
      ])],
      sex: [predefined.sex, Validators.required],
      state: [predefined.state, Validators.required],
      neighborhood: [predefined.neighborhood],
      age: [predefined.age],
    };
    if ( !partial ) {
      fields = {
        tc: [undefined, Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        ...pfields
      }
      options = {
        validator: [
          this.mustMatch('password',
          'confirmPassword'), this.checkTC
        ]
      };
    }
    else {
      this.full = false;
      fields = pfields;
    }
    this.user_data = this.formBuilder.group( fields, options);
    if ( this.disabled ) {
      this.user_data.disable();
    }
    console.log('End predefined');
    this._formLoaded.next(true);
  }
  //
  togglePass() {
   this.showPass = !this.showPass;
  }
  //
  register() {
    this.session.isLoading = true;
    this.setNotificationMessages();
    if ( this.auth.isLogged ){
      this.auth.updateUser( this.user_data.value ).then(
        (res) => {
          this.session.isLoading = false;
          if (res) {
            this.notify.showNotification(this.infoMessage);
          }
          else {
            this.notify.showNotification(this.errorMessage);
          }
          this.editProfile();
        }
      );
    }
    else {
      //save pass for later login
      let pass = this.user_data.value.password;
      this.auth.createUser( {user: this.user_data.value} ).subscribe((res) => {
        if (res) {
          this.auth.loginUser(this.user_data.value.email, pass ).subscribe((res) => {
            this.session.isLoading = false;
            if (res) {
              this.notify.showNotification(this.infoMessage);
              this.navCtrl.navigateBack('/usuario/perfil');
            }
            else {
              this.notify.showNotification(this.errorMessage);
            }
          });
        }
        else {
          this.session.isLoading = false;
          this.notify.showNotification(this.errorMessage);
        }
      });
    }
    setTimeout(() => {
      if ( this.session.isLoading ) {
        this.session.isLoading = false;
        this.notify.showNotification(this.errorMessage);
      }
    }, 10000);
  }
  // Sets messages in execution to get the right one
  setNotificationMessages() {
    this.infoMessage = {
      id: null,
      type: 'notification',
      class: 'info-outline',
      title: this.full ? 'Se ha creado tu usuario' : 'Se ha modificado tu usuario',
      note: "Ya es posible realizar reportes de problemas con los contenedores o aportar fotos para contribuir a majorar el ecosistema de reciclaje. Muchas gracias."
    };
    this.errorMessage = {
      id: null,
      type: 'notification',
      class: 'warnings-error',
      title: this.full ? 'No hemos podido crear tu cuenta' : 'No hemos podido modificar tu cuenta',
      note: "Por favor escribir a devops@data.org.uy y explicar el problema, agradecemos tu esfuerzo y pedimos disculpas por las molestias ocasionadas. Muchas gracias."
    }
  }
  //Mail for pass change
  newPass() {
    this.session.isLoading = true;
    let message = {
      id: null,
      type: 'notification',
      class: 'warnings',
      title: 'Hemos enviado un correo a tu cuenta.',
      note: "Por favor revisa tu correo y sigue los pasos que se indican en el mensaje para cambiar tu contraseña. Muchas gracias."
    }
    this.auth.requestToken( {email: this.auth.user.email} ).subscribe(
      (res) => {
        this.session.isLoading = false;
        if (!res) {
          message.class = 'warnings-error';
          message.title = 'No hemos podido iniciar el cambio';
          message.note = "Por favor escribir a devops@data.org.uy y explicar el problema, agradecemos tu esfuerzo y pedimos disculpas por las molestias ocasionadas. Muchas gracias."
        }
      },
      () => {
        this.session.isLoading = false;
        message.class = 'warnings-error';
        message.title = 'No hemos podido iniciar el cambio';
        message.note = "Por favor escribir a devops@data.org.uy y explicar el problema, agradecemos tu esfuerzo y pedimos disculpas por las molestias ocasionadas. Muchas gracias."
      }
    );
    this.notify.showNotification(message);
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
  public checkTC(c: AbstractControl){
    if(c.get('tc').value == false){
      return false;
    }
    return true;
  }
}
