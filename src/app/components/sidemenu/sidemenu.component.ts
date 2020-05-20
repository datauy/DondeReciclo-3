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
      icon: 'newspaper-outline'
    },
    {
      title: 'Programas',
      desc: 'Y ciclo de vida de los residuos',
      url: '/programas',
      icon: 'leaf-outline'
    },
    {
      title: 'Empresas',
      desc: 'Marcas que hacen posible esta app',
      url: '/empresas',
      icon: 'handshake-outline'
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

  menuWillOpen(){
    console.log('menu will open')
  }

  toggleMenu(){
    this.menuCtrl.toggle(); //Add this method to your button click function
  }


}
