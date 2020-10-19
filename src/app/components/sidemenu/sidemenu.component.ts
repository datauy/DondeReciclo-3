import { Component, OnInit, ViewChild } from '@angular/core';
import { IonMenu, MenuController, IonSearchbar, NavController } from '@ionic/angular';
import { ApiService } from "src/app/services/api.service";
import { SessionService } from "src/app/services/session.service";
import { AuthService } from "src/app/services/auth.service";
import { MapService } from "src/app/services/map.service";
import { environment } from 'src/environments/environment';
//import { createAnimation, Animation } from '@ionic/core';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  @ViewChild(IonMenu, { static: false }) public sidemenu: IonMenu;
  //@ViewChild("#search-app-component", { static: false }) private searchBar: HTMLElement;
  public appPages = [
    {
      title: 'Novedades',
      desc: 'Sobre clasificación y reciclaje',
      url: 'novedades',
      icon: 'dr-newspaper'
    },
    {
      title: 'Programas',
      desc: 'Ciclo de vida de los residuos',
      url: 'programas',
      icon: 'dr-recycle'
    },
    {
      title: 'Auspiciantes',
      desc: 'Marcas que hacen posible esta app',
      url: 'empresas',
      icon: 'dr-empresas'
    }
    //,
    //{
      //title: 'Inicio',
      //desc: 'Volver al mapa',
      //url: 'intro',
      //icon: 'dr-inicio'
    //}
  ];


  constructor(
    private menuCtrl: MenuController,
    public api: ApiService,
    public session: SessionService,
    public auth: AuthService,
    private map: MapService,
  ) {
  }

  ngOnInit() {
    this.api.loadInitialData().subscribe( () =>  { // console.log(this.predefinedOptions)
    });
    this.auth.isLoggedIn();
  }

  toggleMenu(){
    this.menuCtrl.toggle(); //Add this method to your button click function
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
    this.toggleMenu();
  }
  //Country selection
  selectCountry(country: string) {
    this.session.setCountry(country);
    this.map.center = environment[country].center;
    //Move to new center
    this.map.resizeMap(16);
    this.toggleMenu();
  }
}
