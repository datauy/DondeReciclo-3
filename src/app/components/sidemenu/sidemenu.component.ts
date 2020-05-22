import { Component, OnInit, ViewChild } from '@angular/core';
import { IonMenu, MenuController, IonSearchbar } from '@ionic/angular';
import { ApiService } from "src/app/services/api.service";
import { createAnimation, Animation } from '@ionic/core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  @ViewChild(IonMenu, { static: false }) public sidemenu: IonMenu;

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
    private menuCtrl: MenuController,
    public api: ApiService<any>
  ) {
    // this.sidemenu.ionWillOpen.subscribe(data => {
    //     console.log('menu open');
    // });

 }

  ngOnInit() {
    this.api.loadInitialData().subscribe(
      () =>  { this.menuState = this.api.menuState;
        // console.log(this.predefinedOptions)
      }
    );
 }

  toggleMenu(){
    this.menuCtrl.toggle(); //Add this method to your button click function
  }

  menuWillOpen(){
    console.log('menu will open');
    createAnimation()
    .addElement(document.querySelector('#search-app-content'))
    .duration(100)
    .iterations(1)
    .easing('ease-out')
    .keyframes([
      { offset: 0, opacity: 1 },
      { offset: 1, opacity: 0 }
    ],).play();
  }

  menuWillClose(){
    console.log('menu will close');
    createAnimation()
    .addElement(document.querySelector('#search-app-content'))
    .duration(200)
    .iterations(1)
    .easing('ease-in')
    .keyframes([
      { offset: 0, opacity: 0 },
      { offset: 1, opacity: 1 }
    ]).play();
  }

}
