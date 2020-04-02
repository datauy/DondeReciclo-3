import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  public appPages = [
    {
      title: 'Inicio',
      url: '/inicio',
      icon: 'home'
    },
    {
      title: 'Mapa',
      url: '/mapa',
      icon: 'map'
    },
    {
      title: 'Mapa2',
      url: '/mapa2',
      icon: 'map'
    },
    {
      title: 'Mapa3',
      url: '/mapa3',
      icon: 'map'
    }
  ];


  constructor(

  ) { }

  ngOnInit() { }

}