import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  public appPages = [
    {
<<<<<<< HEAD
      title: 'Inicio',
      url: '/',
=======
      title: 'Intro',
      url: '/intro',
>>>>>>> Slider implemented in basic mode.
      icon: 'home-outline'
    },
    {
      title: 'Mapa',
      url: '/tabsnav/mapa',
      icon: 'map-outline'
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


  constructor(

  ) { }

  ngOnInit() { }

}