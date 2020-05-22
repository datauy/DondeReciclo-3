import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {}


  toggleMenu() {
      this.menuCtrl.toggle(); //Add this method to your button click function
    }

}
