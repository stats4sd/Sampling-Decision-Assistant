import { Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class ServiceWorkerService {
  constructor(private updates: SwUpdate, private toastCtrl: ToastController) {
    console.log("hello sw service");
  }

  async checkForUpdate() {
    console.info("checking for udpates");
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(async event => {
        const toast = await this.toastCtrl.create({
          message:
            "New Update available! Reload this page to see the latest version.",
          position: "bottom",
          showCloseButton: true,
          closeButtonText: "Reload"
        });
        await toast.present();
        await toast.onDidDismiss();
        await this.updates.activateUpdate();
        location.reload();
      });
      this.updates.activated.subscribe(event => {
        console.log("old version was", event.previous);
        console.log("new version is", event.current);
      });
    }
  }
}
