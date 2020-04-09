import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SobreElProyectoPage } from './sobre-el-proyecto.page';

const routes: Routes = [
  {
    path: '',
    component: SobreElProyectoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SobreElProyectoPageRoutingModule {}
