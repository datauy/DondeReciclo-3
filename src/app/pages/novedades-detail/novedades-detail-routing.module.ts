import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovedadesDetailPage } from './novedades-detail.page';

const routes: Routes = [
  {
    path: '',
    component: NovedadesDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NovedadesDetailPageRoutingModule {}
