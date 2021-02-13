import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsnavPage } from './tabsnav.page';
import { ContactFormComponent } from 'src/app/components/contact-form/contact-form.component';
import { AboutPage } from 'src/app/components/static-pages/about.page';

const routes: Routes = [
  {
    path: '',
    component: TabsnavPage,
    children: [
      {
        path: '',
        redirectTo: 'mapa',
        pathMatch: 'full',
      },
      {
        path: 'sobre-el-proyecto',
        component: AboutPage
      },
      {
        path: 'consejos',
        loadChildren: () => import('../consejos/consejos.module').then( m => m.ConsejosPageModule)
      },
      {
        path: 'mapa',
        children: [
          {
            path: '',
            loadChildren: () => import('../mapa/mapa.module').then( m => m.MapaPageModule),
          },
          {
            path: ':containerID',
            loadChildren: () => import('../mapa/mapa.module').then( m => m.MapaPageModule),
          }
        ]
      },
      {
        path: 'fichas',
        loadChildren: () => import('../cards/cards.module').then( m => m.CardsPageModule)
      },
      {
        path: 'contacto',
        component: ContactFormComponent
      },
    ]
  },
  {
    path: '',
    redirectTo: 'mapa',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsnavPageRoutingModule {}
