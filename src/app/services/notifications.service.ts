import { Injectable } from '@angular/core';
import { Message } from 'src/app/models/basic_models.model';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  //Search items
  message: Message;
  messageBack: Message;
  showMessage: boolean = true;

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
}
