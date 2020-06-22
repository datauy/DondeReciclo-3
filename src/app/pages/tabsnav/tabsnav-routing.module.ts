import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsnavPage } from './tabsnav.page';


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
        loadChildren: () => import('../sobre-el-proyecto/sobre-el-proyecto.module').then( m => m.SobreElProyectoPageModule)
      },
      {
        path: 'consejos',
        loadChildren: () => import('../consejos/consejos.module').then( m => m.ConsejosPageModule)
      },
      {
        path: 'mapa',
        loadChildren: () => import('../mapa/mapa.module').then( m => m.MapaPageModule)
      },
      {
        path: 'fichas',
        loadChildren: () => import('../cards/cards.module').then( m => m.CardsPageModule)
      },
      {
        path: 'contacto',
        loadChildren: () => import('../contacto/contacto.module').then( m => m.ContactoPageModule)
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
