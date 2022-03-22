import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPage } from './components/static-pages/notfound.page';
import { PrivacyPolicyPage } from './components/static-pages/privacy_policy.page';
import { RecyclersPage } from './components/static-pages/recyclers.page';

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
    loadChildren: () => import('./pages/programs/programs.module').then( m => m.ProgramsPageModule)
  },
  {
    path: 'novedades',
    loadChildren: () => import('./pages/news/news.module').then( m => m.NewsPageModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'privacidad',
    component: PrivacyPolicyPage
  },
  {
    path: 'recicladores',
    component: RecyclersPage
  },
  {
    path: '**',
    component: NotFoundPage
  },
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
