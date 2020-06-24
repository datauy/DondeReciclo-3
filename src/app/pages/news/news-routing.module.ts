import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsPage } from './news.page';
import { NewsDetailPage } from './news-detail.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: NewsPage
      },
      {
        path: ':novedadID',
        component: NewsDetailPage
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsPageRoutingModule {}
