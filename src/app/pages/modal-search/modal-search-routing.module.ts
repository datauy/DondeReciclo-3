import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalSearchPage } from './modal-search.page';

const routes: Routes = [
  {
    path: '',
    component: ModalSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalSearchPageRoutingModule {}
