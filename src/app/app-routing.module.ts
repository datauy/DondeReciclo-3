import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPage } from './components/static-pages/notfound.page';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  {
    path: 'intro',
    loadChildren: () => import('./pages/tabsnav/tabsnav.module').then( m => m.TabsnavPageModule)
  },
  {
    path: 'empresas',
    loadChildren: () => import('./pages/partners/partners.module').then( m => m.PartnersPageModule)
  },
  {
    path: 'consejos',
    loadChildren: () => import('./pages/consejos/consejos.module').then( m => m.ConsejosPageModule)
  },
  {
    path: 'programas',
    loadChildren: () => import('./pages/programas/programas.module').then( m => m.ProgramasPageModule)
  },
  {
    path: 'novedades',
    loadChildren: () => import('./pages/news/news.module').then( m => m.NewsPageModule)
  },
  {
    path: '**',
    component: NotFoundPage
  },
  {
    path: 'partners',
    loadChildren: () => import('./pages/partners/partners.module').then( m => m.PartnersPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes //{
        // enableTracing: true,
        //preloadingStrategy: PreloadAllModules},
      )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
