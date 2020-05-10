import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  public appPages = [
    {
      title: 'Inicio',
      url: '/intro',
      icon: 'home-outline'
    },
    {
      title: 'Novedades',
      url: '/novedades',
      icon: 'newspaper-outline'
    },
    {
      title: 'Marcas',
      url: '/marcas',
      icon: 'briefcase-outline'
    }
  ];


  constructor(private menu: MenuController

  ) { }

  ngOnInit() {

        this.menu.open('menu-content');
   }

}
