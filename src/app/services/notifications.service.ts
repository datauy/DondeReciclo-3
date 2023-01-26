import { Injectable } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';

import { FirebaseX } from "@awesome-cordova-plugins/firebase-x/ngx";
import { Message } from "src/app/models/message.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private firebase: FirebaseX,
    private platform: Platform,
    private navCtl: NavController,
  ) { }

  //Search items
  message: Message;
  messageBack: Message;
  showMessage: boolean = true;

  public notificationSetup() {
    //Por ahora no guardamos el token
    //this.getToken();
    this.onNotifications().subscribe(
      (msg) => {
        let url, message;
        if (this.platform.is('ios')) {
          message = msg.aps.alert;
        }
        else {
          message = msg;
        }
        if ( msg.type != undefined ) {
          url = '/' + msg.type;
          url += msg.type_id != undefined ? '/' + msg.type_id : '';
        }
        if ( msg.tap == undefined ) {
          //La aplicación está funcionando
          if ( url != '' ) {
            message.link = url;
            message.link_title = msg.link_title != undefined ? msg.link_title : 'Vamos!';
          }
          this.showNotificationMessage(message);
        }
        else {
          //Tiene link
          if ( msg.type != undefined ) {
            this.navCtl.navigateBack(url);
          }
        }
      }
    );
  }
  //
  showNotificationMessage(message: any) {
    let notification = {
      id: null,
      type: 'notification',
      class: 'warnings',
      title: message.title ? message.title : 'Mensaje importante!',
      note: message.body,
      link: message.link ? message.link : null,
      link_title: message.link_title ? message.link_title : null,
    };
    this.showNotification(notification);
  }
  //
  showNotification(notification: Message) {
    if ( this.message && this.message.id != notification.id ) {
      this.messageBack = this.message;
    }
    this.message = notification;
  }
  //
  notificationClose() {
    if ( this.messageBack ) {
      this.message = this.messageBack;
      delete this.messageBack;
    }
    else {
      delete this.message
    }
    return;
  }
  closeNotificationId(id: string) {
    if ( this.messageBack != undefined && this.messageBack.id != undefined && this.messageBack.id == id ) {
      delete this.messageBack;
    }
    if ( this.message != undefined && this.message.id != undefined && this.message.id == id ) {
      this.notificationClose();
    }
    return;
  }
  //
  notificationCommingSoon() {
    let notification = {
      id: null,
      type: 'notification',
      class: 'warnings',
      title: 'Funcionalidad disponible en breve',
      note: 'Registrate para enterarte apenas esté disponible.'
    };
    this.showNotification(notification);
  }
  //
  async getToken() {
    let token: string;

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }
    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }
    this.saveToken(token);
  }
  //
  private saveToken(token: string) {
    if (!token) return;
    //const devicesRef = this.afs.collection('devices');
    const data = {
      token,
      userId: 'testUserId'
    };
    console.log(data);
    //return devicesRef.doc(token).set(data);
  }
  //
  onNotifications() {
    return this.firebase.onMessageReceived();
  }
}
