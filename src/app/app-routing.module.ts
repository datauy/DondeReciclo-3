import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPage } from './components/static-pages/notfound.page';
import { PrivacyPolicyPage } from './components/static-pages/privacy_policy.page';
import { RecyclersPage } from './components/static-pages/recyclers.page';
import { ContactFormComponent } from 'src/app/components/contact-form/contact-form.component';
import { AboutPage } from 'src/app/components/static-pages/about.page';
import { StatsPage } from './components/static-pages/stats.page';


const routes: Routes = [
  //{ path: '', component: MapaPage, pathMatch: 'full' },
  {
    path: '',
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
    path: 'fichas',
    loadChildren: () => import('./pages/cards/cards.module').then( m => m.CardsPageModule)
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
    path: 'estadisticas',
    component: StatsPage
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
