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
      'title': 'Búsqueda y filtro',
      'note': 'Desde aquí se pueden buscar materiales, residuos o direcciones para ver los puntos en el mapa.',
      'layout': "search"
    },
    {
      'title': 'Servicios disponibles',
      'note': 'También mapeamos servicios de recolección o entrega por zonas. Aquí se ven los disponibles en tu ubicación.',
      'layout': "services"
    },
    {
      'title': 'Encontrar puntos y zonas en el mapa',
      'note': 'Haciendo click en un punto se accede a la información completa. También es posible ver las zonas de servicio con el botón a la izquierda.',
      'layout': "middle"
    },
    {
      'title': '¡Mucha más información!',
      'note': 'Consejos de reciclaje, fichas de materiales y más desde el menú.',
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
