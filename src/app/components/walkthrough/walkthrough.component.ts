import { Component, OnInit, Input } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.component.html',
  styleUrls: ['./walkthrough.component.scss'],
})
export class WalkthroughComponent implements OnInit {
  //@Input('step') step: number;
  //@Input('layout') layout: string;
  delay_notification = false;
  step = 0;
  steps = [
    {
      'title': 'Buscá y filtrá por acción o material',
      'note': 'Podés encontrar muchos residuos y materiales que ya tienen su deposición en tu zona! Buscá tu dirección o localizate en el mapa.',
      'layout': "search"
    },
    {
      'title': 'Conocé los servicios disponibles',
      'note': 'Al moverte en el mapa, podrás ver los servicios activos en la zona con la información correspondiente.',
      'layout': "services"
    },
    {
      'title': 'Encontrá puntos dónde reciclar',
      'note': 'Al moverte en el mapa, podrás ver los servicios activos en la zona con la información correspondiente.',
      'layout': "middle"
    },
    {
      'title': 'Muchas opciones más!',
      'note': 'Podés encontrar muchos residuos y materiales que ya tienen su deposición en tu zona! Buscá tu dirección o localizate en el mapa.',
      'layout': "menu"
    },
  ];
  constructor(
    private session: SessionService,
    private notification: NotificationsService
  ) { }

  ngOnInit() {
    if ( this.notification.showMessage == true ) {
      this.delay_notification = true;
      this.notification.showMessage = false;
    }
  }
  //
  changeStep() {
    if ( this.notification.showMessage == true ) {
      this.delay_notification = true;
      this.notification.showMessage = false;
    }
    if ( this.steps.length == this.step + 1 ) {
      this.closeWalk();
    }
    else {
      this.step = this.step + 1;
    }
  }
  //
  closeWalk() {
    if (this.delay_notification) {
      this.notification.showMessage = true;
    }
    this.session.watchSlider(false);
  }
}
