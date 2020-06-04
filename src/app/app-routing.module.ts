import { NgModule} from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  {
    path: 'intro',
    loadChildren: () => import('./pages/tabsnav/tabsnav.module').then( m => m.TabsnavPageModule)
  },
  {
    path: 'novedades',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/novedades/novedades.module').then( m => m.NovedadesPageModule)
      },
      {
        path: 'novedades-detail/:novedadID',
        loadChildren: () => import('./pages/novedades-detail/novedades-detail.module').then(m => m.NovedadesDetailPageModule)
      }
    ]
  },
  {
    path: 'empresas',
    loadChildren: () => import('./pages/empresas/empresas.module').then( m => m.EmpresasPageModule)
  },
  {
    path: 'novedades-detail',
    loadChildren: () => import('./pages/novedades-detail/novedades-detail.module').then( m => m.NovedadesDetailPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { preloadingStrategy: PreloadAllModules},

      )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
