import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsejosPage } from './consejos.page';

const routes: Routes = [
  {
    path: '',
    component: ConsejosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsejosPageRoutingModule {}
