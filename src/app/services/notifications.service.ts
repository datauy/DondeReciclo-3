import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { FirebaseX } from "@ionic-native/firebase-x/ngx";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private firebase: FirebaseX,
    private platform: Platform,

  ) { }

  //Search items
  message: Message;
  messageBack: Message;
  showMessage: boolean = true;

  showNotificationMessage(message: string) {
    let notification = {
      id: null,
      type: 'notification',
      class: 'warnings',
      title: 'Mensaje importante!',
      note: message
    };
    this.showNotification(notification);
  }

  showNotification(notification: Message) {
    console.log(notification);
    if ( this.message ) {
      this.messageBack = this.message;
    }
    this.message = notification;
  }
  notificationClose() {
    if ( this.messageBack ) {
      this.message = this.messageBack;
      delete this.messageBack;
    }
    else {
      delete this.message
    }
    console.log(this.message);
  }
  notificationCommingSoon() {
    console.log('Comming soon');
    let notification = {
      id: null,
      type: 'notification',
      class: 'warnings',
      title: 'Funcionalidad disponible en breve',
      note: 'Registrate para enterarte apenas esté disponible.'
    };
    this.showNotification(notification);
  }
  async getToken() {
    let token: string;
    console.log('Get token');
    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }
    console.log(token);
    this.saveToken(token);
  }

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

  onNotifications() {
    return this.firebase.onMessageReceived();
  }
}
export interface Message {
  id: string;
  type: string;
  title: string;
  class: string;
  note: string;
}
