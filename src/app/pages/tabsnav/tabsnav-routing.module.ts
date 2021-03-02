import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';

import { TabsnavPage } from './tabsnav.page';
import { ContactFormComponent } from 'src/app/components/contact-form/contact-form.component';
import { AboutPage } from 'src/app/components/static-pages/about.page';
import { MapaPage } from 'src/app/pages/mapa/mapa.page';

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
        path: 'contacto',
        component: ContactFormComponent
      },
      {
        path: 'consejos',
        loadChildren: () => import('../consejos/consejos.module').then( m => m.ConsejosPageModule)
      },
      {
        path: 'fichas',
        loadChildren: () => import('../cards/cards.module').then( m => m.CardsPageModule)
      },
      {
        path: 'mapa',
        children: [
          {
            path: '',
            component: MapaPage
          },
          {
            path: 'contenedor/:containerID',
            component: MapaPage
          },
          {
            path: 'material/:materialID',
            component: MapaPage
          },
          {
            path: 'residuo/:wasteID',
            component: MapaPage
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsnavPageRoutingModule {}
