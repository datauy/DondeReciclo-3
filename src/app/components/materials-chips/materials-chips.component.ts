import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Material } from "src/app/models/basic_models.model";
import { ApiService } from "src/app/services/api.service";
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-materials-chips',
  templateUrl: './materials-chips.component.html',
  styleUrls: ['./materials-chips.component.scss'],
})
export class MaterialsChipsComponent implements OnInit {
  @Input('materials_obj') materials_obj: any;
  chips: Material[];

  constructor(
    private api: ApiService,
    private session: SessionService,
  ) {
   }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if ( Object.keys(changes['materials_obj'].currentValue).length !== 0 ) {
      let materials_obj = changes['materials_obj'].currentValue;
      this.chips = [];
      if ( materials_obj.materials != undefined ) {
        if ( materials_obj.materials.length == 0 ) {
          this.api.getWastes(materials_obj.wastes).subscribe((wastes) => {
            this.chips = wastes;
          });
        }
        else {
          materials_obj.materials.forEach((i) => {
            this.chips.push(this.api.materials[this.session.country][i]);
          });
        }
      }
    }
  }
}
