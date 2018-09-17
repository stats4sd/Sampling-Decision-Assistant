import { Component } from "@angular/core";
import { AlertController, ViewController } from "ionic-angular";
import { DataProvider } from "../../../providers/data/data";

@Component({
  selector: "decision-tool-menu",
  templateUrl: "decision-tool-menu.html"
})
export class DecisionToolMenuComponent {
  constructor(
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private dataPrvdr: DataProvider
  ) {
    console.log("Hello DecisionToolMenuComponent Component");
  }
  dismiss(param) {
    this.viewCtrl.dismiss(param);
  }

  saveAs() {
    const alert = this.alertCtrl.create({
      title: "Save project as",
      inputs: [
        {
          name: "title",
          placeholder: "Title"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        },
        {
          text: "Save",
          handler: data => {
            if (data.title) {
              this.dataPrvdr.saveProjectAs(data.title);
            }
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    alert.present();
  }
}
