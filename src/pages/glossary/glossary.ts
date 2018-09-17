import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";

/*
Simple page placeholder for glossary page
*/

@IonicPage({
  segment: "glossary",
  defaultHistory: ["HomePage"]
})
@Component({
  selector: "page-glossary",
  template: `
  <ion-header>
  <ion-navbar color="primary">
    <ion-title>Glossary</ion-title>
    <ion-buttons end *ngIf="modalMode">
      <button ion-button icon-right (click)="dismiss()">
        Close
        <ion-icon name="close"></ion-icon>
      </button>
    </ion-buttons>
  </ion-navbar>
</ion-header>
<ion-content padding>
  <glossary-list displayMode="page"></glossary-list>
</ion-content>`
})
export class GlossaryPage {
  constructor(public navCtrl: NavController) {}
}
