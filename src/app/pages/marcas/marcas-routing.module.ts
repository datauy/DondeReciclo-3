import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarcasPage } from './marcas.page';

const routes: Routes = [
  {
    path: '',
    component: MarcasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarcasPageRoutingModule {}
