import { Component, OnInit, ViewChild } from '@angular/core';
import { IonMenu, MenuController} from '@ionic/angular';
import { ApiService } from "src/app/services/api.service";
import { SessionService } from "src/app/services/session.service";
import { AuthService } from "src/app/services/auth.service";
import { environment } from 'src/environments/environment';
import { MapService } from "src/app/services/map.service";
import { Router } from "@angular/router";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  providers: [InAppBrowser]
})
export class SidemenuComponent implements OnInit {

  @ViewChild(IonMenu, { static: false }) public sidemenu: IonMenu;
  //@ViewChild("#search-app-component", { static: false }) private searchBar: HTMLElement;
  public appDR = [
    {
      title: 'El proyecto',
      desc: 'Quienes somos. Contacto.',
      url: 'sobre-el-proyecto',
      icon: 'dr-proyecto'
    },
    {
      title: 'Novedades',
      desc: 'Últimas noticias relacionadas',
      url: 'novedades',
      icon: 'dr-news'
    },
    {
      title: 'Auspiciantes',
      desc: 'Empresas que hacen posible esta app',
      url: 'empresas',
      icon: 'dr-empresas'
    }
  ]


  constructor(
    private menuCtrl: MenuController,
    public api: ApiService,
    public session: SessionService,
    public auth: AuthService,
    private router: Router,
    public map: MapService,
    private iab: InAppBrowser
  ) {
  }

  ngOnInit() {
    this.auth.isLoggedIn();
  }

  toggleMenu( link = null ){
    this.menuCtrl.toggle();
    if ( link ) {
      this.iab.create(link, '_system');
    }
  }
  //
  introSlide() {
    this.menuCtrl.toggle();
    this.session.watchSlider(true);
  }
  //
  menuWillOpen() {
    // this.searchBar.classList.add('hide');
  }
  //
  menuWillClose() {
    // this.searchBar.classList.remove('hide');
  }
  closeSession() {
    this.auth.logout();
    this.router.navigate(['/']);
    this.toggleMenu();
  }
  goToMap() {
    this.map.reRoute();
  }
}
