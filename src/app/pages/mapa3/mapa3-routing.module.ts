import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Mapa3Page } from './mapa3.page';

const routes: Routes = [
  {
    path: '',
    component: Mapa3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Mapa3PageRoutingModule {}
