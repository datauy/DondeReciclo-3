import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPageRoutingModule } from './user-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { UserPage } from './user.page';
import { RegisterForm } from './register.form';
import { LoginForm } from './login.form';
import { ReportForm } from './report.form';
import { ForgotForm } from './forgot.form';
import { PasswordForm } from './password.form';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UserPageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    UserPage,
    RegisterForm,
    LoginForm,
    ReportForm,
    ForgotForm,
    PasswordForm
  ]
})
export class UserPageModule {}
