import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Mapa2Page } from './mapa2.page';

const routes: Routes = [
  {
    path: '',
    component: Mapa2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Mapa2PageRoutingModule {}
