import { Component } from "@angular/core";
import { ModalController, Events } from "@ionic/angular";
import { IntroductionTextPage } from "./introduction-text/introduction-text";
import { SavedInfoComponent } from "src/app/components/modals/saved-info/saved-info.component";

@Component({
  selector: "introduction",
  templateUrl: "introduction.html",
  styleUrls: ["introduction.scss"]
})
export class IntroductionComponent {
  showIntro: boolean;
  constructor(public modalCtrl: ModalController, public events: Events) {}

  async startNew() {
    const modal = await this.modalCtrl.create({
      component: SavedInfoComponent,
      componentProps: { view: "save" },
      cssClass: "full-screen"
    });
    await modal.present();
    const dismiss = await modal.onDidDismiss();
    const data = dismiss.data;
    if (data) {
      this.events.publish("project:loaded", data);
    }
  }
  async load() {
    const modal = await this.modalCtrl.create({
      component: SavedInfoComponent,
      componentProps: { view: "load" },
      cssClass: "full-screen"
    });
    await modal.present();
    const dismiss = await modal.onDidDismiss();
    const data = dismiss.data;
    if (data) {
      this.events.publish("project:loaded", data);
    }
  }
  async showIntroText() {
    let modal = await this.modalCtrl.create({
      component: IntroductionTextPage,
      cssClass: "full-screen"
    });
    await modal.present();
  }
}
