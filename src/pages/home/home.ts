import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import version from "../../pages/changelog/version";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  sections: any = [];
  altSections: any = [];
  version: any = version;
  imageSrc = "assets/img/feature-image-1.jpg";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController
  ) {
    this.sections = [
      { name: "Use the Tool", page: "StepByStepPage" },
      {
        name: "Tutorial and Examples",
        page: "TutorialPage"
      }
    ];

    this.altSections = [
      { name: "Glossary of technical terms", page: "GlossaryPage" }
    ];
  }

  ngOnInit() {
    this.checkForUpdates();
  }
  //
  goToSection(section) {
    if (section.class != "disabled") {
      this.navCtrl.push(section.page, section.params);
    }
  }

  showChangelog() {
    this.navCtrl.push("ChangelogPage");
  }

  goToAdmin() {
    this.navCtrl.push("AdminPage");
  }

  checkForUpdates() {
    // https://medium.com/progressive-web-apps/pwa-create-a-new-update-available-notification-using-service-workers-18be9168d717
    window["isUpdateAvailable"]()
      .then(
        isAvailable => {
          console.log("update available?", isAvailable);
          if (isAvailable) {
            const toast = this.toastCtrl.create({
              message:
                "New Update available! Reload this page to see the latest version.",
              position: "bottom",
              showCloseButton: true,
              closeButtonText: "Reload"
            });
            toast.onDidDismiss(() => {
              location.reload();
            });
            toast.present();
          }
        },
        notAvailable => {
          console.log("no update available");
        }
      )
      .catch(err => console.error(err));
  }
}
