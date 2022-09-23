import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramsPage } from './programs.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProgramsPage
      },
      {
        path: ':programID',
        component: ProgramsPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramsPageRoutingModule {}
