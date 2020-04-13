
import { Component, OnInit } from "@angular/core";

import { ModalController, NavController } from "@ionic/angular";

import { Novedad } from "../../models/novedad.model";
import { NovedadService } from "../../services/novedad.service";

@Component({
  selector: "app-novedades",
  templateUrl: "./novedades.page.html",
  styleUrls: ["./novedades.page.scss"],
})
export class NovedadesPage implements OnInit {

  novedad = {} as Novedad;
  novedades: Novedad[];

  constructor(private novedadesService: NovedadService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.novedadesService.get().subscribe((novedades: Novedad[]) => {
      this.novedades = novedades;
      console.log(novedades)
    });
  }  

}
