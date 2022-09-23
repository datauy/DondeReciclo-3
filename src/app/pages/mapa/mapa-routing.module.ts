import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaPage } from './mapa.page';

const routes: Routes = [
  {
    path: '',
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
      {
        path: 'intro/mapa',
        component: MapaPage
      },
      {
        path: 'intro/mapa/contenedor/:containerID',
        component: MapaPage
      },
      {
        path: 'intro/mapa/material/:materialID',
        component: MapaPage
      },
      {
        path: 'intro/mapa/residuo/:wasteID',
        component: MapaPage
      },
      {
        path: 'intro/mapa/subprograma/:subsID',
        component: MapaPage
      },
      {
        path: 'intro/mapa/contenedores/:containersID',
        component: MapaPage
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaPageRoutingModule {}
