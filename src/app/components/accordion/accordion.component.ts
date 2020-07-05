import { Component, ViewChild, OnInit, Renderer, Input } from '@angular/core';

@Component({
  selector: 'accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  accordionExapanded = true;
  @ViewChild("cc", {static: true}) cardContent: any;
  @Input('title') title: string;
  @Input('img') img: string = '';

  icon: string = "remove-circle-sharp";

  constructor(public renderer: Renderer) {

  }

  ngOnInit() {
    this.cardContent.el.transition = "max-height 500ms, padding 500ms";
    this.renderer.setElementStyle(
      this.cardContent.el,
      "webkitTransition",
      "max-height 500ms, padding 500ms"
    );
    this.toggleAccordion();
  }

  toggleAccordion() {
    if (this.accordionExapanded) {
      this.renderer.setElementStyle(this.cardContent.el, "max-height", "0px");
      this.renderer.setElementStyle(this.cardContent.el, "padding", "0px 16px");
    } else {
      this.renderer.setElementStyle(this.cardContent.el, "max-height", "none");
      this.renderer.setElementStyle(this.cardContent.el, "padding", "13px 0");
    }
    this.accordionExapanded = !this.accordionExapanded;
    this.icon = this.icon == "remove-circle-sharp" ? "add-circle-sharp" : "remove-circle-sharp";
  }

}
