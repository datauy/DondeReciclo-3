import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaPage } from './mapa.page';

const routes: Routes = [
  {
    path: '',
    component: MapaPage,
    children: [
      {
        path: '',
        component: MapaPage
      },
      {
        path: 'contenedor/:containerID',
        component: MapaPage
      },
      {
        path: 'material/:materialID',
        component: MapaPage
      },
      {
        path: 'residuo/:wasteID',
        component: MapaPage
      },
      {
        path: 'subprograma/:subsID',
        component: MapaPage
      },
      {
        path: 'contenedores/:containersID',
        component: MapaPage
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaPageRoutingModule {}
