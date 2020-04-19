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
      url: '/tabsnav',
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


  constructor(

  ) { }

  ngOnInit() { }

}