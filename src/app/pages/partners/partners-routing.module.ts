import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartnersPage } from './partners.page';

const routes: Routes = [
  {
    path: '',
    component: PartnersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnersPageRoutingModule {}
