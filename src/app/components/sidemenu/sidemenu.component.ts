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
      url: '/novedades',
      icon: 'newspaper-outline'
    },
    {
      title: 'Programas',
      url: '/programas',
      icon: 'recycle-outline'
    },
    {
      title: 'Empresas',
      url: '/empresas',
      icon: 'handshake-outline'
    }
  ];


  constructor(

  ) { }

  ngOnInit() { }

}
