
import { Component, OnInit } from "@angular/core";

import { ModalController, NavController } from "@ionic/angular";

import { Novedad } from "../../models/novedad.model";
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: "app-novedades",
  templateUrl: "./novedades.page.html",
  styleUrls: ["./novedades.page.scss"],
})
export class NovedadesPage implements OnInit {

  novedad = {} as Novedad;
  novedades: Novedad[];

  constructor(
    public session: SessionService
  ) {
    this.session = session;
  }

  ngOnInit() {
    this.getAll();
  }

  ionViewWillEnter(){
    this.session.breakPoint = "subpage";
  }

  getAll() {
    /*this.novedadesService.get().subscribe((novedades: Novedad[]) => {
      this.novedades = novedades;
      console.log(novedades)
    });*/
  }

}
