import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPage } from './components/static-pages/notfound.page';
import { PrivacyPolicyPage } from './components/static-pages/privacy_policy.page';
import { RecyclersPage } from './components/static-pages/recyclers.page';
import { MapaPage } from 'src/app/pages/mapa/mapa.page';
import { ContactFormComponent } from 'src/app/components/contact-form/contact-form.component';
import { AboutPage } from 'src/app/components/static-pages/about.page';

const routes: Routes = [
  { path: '', redirectTo: 'mapa', pathMatch: 'full' },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then( m => m.MapaPageModule)
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
    path: 'clasificadores',
    component: RecyclersPage
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
