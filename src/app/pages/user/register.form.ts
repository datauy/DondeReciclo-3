import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Observable, BehaviorSubject } from 'rxjs';

import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Message } from "src/app/models/message.model";
import { environment } from 'src/environments/environment';

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

  constructor(
    private formBuilder: FormBuilder,
    public session: SessionService,
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
      country_id: 1
    };
    if ( this.auth.isLogged ){
      this.title = 'Perfil';
      this.auth.loadUserData().then(
        (user) => {
          this.disabled = true;
          predefined = {
          name: user.name,
          email: user.email,
          sex: user.sex,
          country_id: user.country_id,
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
      country_id: [predefined.country_id, Validators.required],
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
    //Get country changes for state switch
    this.user_data.get('country_id').valueChanges.subscribe(val => {
      if (val == 2) {
        this.session.country = 'Colombia';
      }
      else {
        this.session.country = 'Uruguay';
      }
    });
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
    if ( this.auth.isLogged ){
      this.auth.updateUser( this.user_data.value ).then(
        (res) => {
          this.session.isLoading = false;
          if (res) {
            this.handleNotifications('info');
          }
          else {
            this.handleNotifications('error');
          }
          this.editProfile();
        }
      );
    }
    else {
      //save pass for later login
      let pass = this.user_data.value.password;
      this.auth.createUser( {user: this.user_data.value} ).subscribe(
        (res) => {
          if (res) {
            if ( res.error ) {
              this.handleNotifications(res.type);
            }
            else {
              this.auth.loginUser(this.user_data.value.email, pass ).subscribe(
                (res) => {
                  if (res) {
                    this.handleNotifications('info');
                    this.navCtrl.navigateBack('/usuario/perfil');
                  }
                  else {
                    this.handleNotifications('error');
                  }
                }
              );
            }
          }
          else {
            this.handleNotifications('error');
          }
        },
        () => {
          this.handleNotifications('error');
        }
      );
    }
    setTimeout(() => {
      if ( this.session.isLoading ) {
        this.handleNotifications('error');
      }
    }, 10000);
  }
  //Mail for pass change
  newPass() {
    this.session.isLoading = true;
    let message = {type: 'new_pass'};
    this.auth.requestToken( {email: this.auth.user.email} ).subscribe(
      (res) => {
        this.session.isLoading = false;
        if (!res) {
          this.handleNotifications('new_pass_error');
        }
        else {
          this.handleNotifications('new_pass');
        }
      },
      () => {
        this.session.isLoading = false;
        this.handleNotifications('new_pass_error');
      }
    );
  }
  handleNotifications(type: any) {
    console.log('Tipo de noty: ' + type);
    let notification: Message = {
      id: 'default',
      type: 'default_error',
      title: 'Error',
      class: 'warnings-errors',
      note: 'Ha ocurrido un error procesando su solicitud, por favor reintente luego o contáctenos a soporte@data.org.uy. Lamentamos los inconvenientes. Muchas gracias'
    };
    if ( type ) {
      switch(type) {
        case 'user_exists': {
          notification = {
            id: type,
            type: 'error',
            title: 'Error',
            class: 'warnings-error',
            note: 'Ya existe un usuario con el email seleccionado. Intente ingresar con su contraseña o solicite una nueva. Gracias'
         }
          break;
        }
        case 'info': {
          notification = {
            id: type,
            type: 'info',
            class: 'info-outline',
            title: this.full ? 'Se ha creado tu usuario' : 'Se ha modificado tu usuario',
            note: "Ya es posible realizar reportes de problemas con los contenedores o aportar fotos para contribuir a majorar el ecosistema de reciclaje. Muchas gracias."
          }
          break;
        }
        case 'error': {
          notification = {
            id: type,
            type: 'info',
            class: 'warnings-error',
            title: this.full ? 'No hemos podido crear tu cuenta' : 'No hemos podido modificar tu cuenta',
            note: "Por favor escribir a devops@data.org.uy y explicar el problema, agradecemos tu esfuerzo y pedimos disculpas por las molestias ocasionadas. Muchas gracias."
          }
          break;
        }
        case 'new_pass': {
          notification = {
            id: type,
            type: 'info',
            class: 'warnings',
            title: 'Hemos enviado un correo a tu cuenta.',
            note: "Por favor revisa tu correo y sigue los pasos que se indican en el mensaje para cambiar tu contraseña. Muchas gracias."
          }
          break;
        }
        case 'new_pass_error': {
          notification = {
            id: type,
            type: 'info',
            class: 'warnings-error',
            title: 'No hemos podido iniciar el cambio',
            note: "Por favor escribir a devops@data.org.uy y explicar el problema, agradecemos tu esfuerzo y pedimos disculpas por las molestias ocasionadas. Muchas gracias."
          }
          break;
        }
      }
    }
    this.session.isLoading = false;
    this.notify.showNotification(notification);
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
  toggleCountry() {
    console.log("Toggle Country");
    if (this.user_data.value.country_id == 2) {
      this.session.country = 'Colombia';
    }
    else {
      this.session.country = 'Uruguay';
    }
  }
  public checkTC(c: AbstractControl){
    if(c.get('tc').value == false){
      return false;
    }
    return true;
  }
}
