import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  constructor( public notification: NotificationsService ) { }

  ngOnInit() {}

  //
  closeNotification() {
    this.notification.notificationClose();
  }
}
