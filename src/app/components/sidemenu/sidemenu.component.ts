import { Component, OnInit, ViewChild } from '@angular/core';
import { IonMenu, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  @ViewChild(IonMenu, { static: false }) public sidemenu: IonMenu;

  menuState: any;

  public appPages = [
    {
      title: 'Novedades',
      desc: 'Ulitmas noticias relacionadas',
      url: '/novedades',
      icon: 'dr-newspaper'
    },
    {
      title: 'Programas',
      desc: 'Y ciclo de vida de los residuos',
      url: '/programas',
      icon: 'dr-recycle'
    },
    {
      title: 'Empresas',
      desc: 'Marcas que hacen posible esta app',
      url: '/empresas',
      icon: 'dr-empresas'
    }
  ];


  constructor(
    private menuCtrl: MenuController
  ) {
    // this.sidemenu.ionWillOpen.subscribe(data => {
    //     console.log('menu open');
    // });

 }

  ngOnInit() { }

  toggleMenu(){
    this.menuCtrl.toggle(); //Add this method to your button click function
  }


}
