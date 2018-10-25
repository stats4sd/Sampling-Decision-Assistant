// button with custom text and video icon, that when clicked loads a youtube video url in a lightframe popup

import { Component } from "@angular/core";
import { Input } from "@angular/core";
import { ModalController } from "ionic-angular";

@Component({
  selector: "video-popup-button",
  template: `
  <button ion-button icon-left clear (click)="showIntroVideo()">
    <ion-icon name="logo-youtube"></ion-icon>{{buttonText}}
  </button>  
  `
})
export class VideoPopupButtonComponent {
  @Input("buttonText")
  buttonText: string;
  @Input("youtubeID")
  youtubeID: string;

  constructor(public modalCtrl: ModalController) {}

  showIntroVideo() {
    console.log("showing intro video", this.youtubeID, this.buttonText);
    this.modalCtrl
      .create(
        "VideoViewerPage",
        { youtubeID: this.youtubeID },
        {
          enableBackdropDismiss: true,
          cssClass: "video-player"
        }
      )
      .present();
  }
}
