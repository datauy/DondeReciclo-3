import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

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

  ) { }

  ngOnInit() { }

}
