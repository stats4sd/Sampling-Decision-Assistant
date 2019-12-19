import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "page-introduction-text",
  templateUrl: "introduction-text.html",
  styleUrls: ["introduction-text.scss"]
})
export class IntroductionTextPage {
  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
