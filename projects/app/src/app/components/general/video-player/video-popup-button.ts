// button with custom text and video icon, that when clicked loads a youtube video url in a lightframe popup

import { Component } from "@angular/core";
import { Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { VideoViewerPage } from "./video-viewer";

@Component({
  selector: "video-popup-button",
  template: `
    <ion-button fill="clear" (click)="showVideo()">
      <ion-icon slot="start" name="logo-youtube"></ion-icon>{{ buttonText }}
    </ion-button>
  `,
  styleUrls: ["./video-player.scss"]
})
export class VideoPopupButtonComponent {
  @Input("buttonText")
  buttonText: string;
  @Input("youtubeID")
  youtubeID: string;

  constructor(public modalCtrl: ModalController) {}

  async showVideo() {
    const modal = await this.modalCtrl.create({
      component: VideoViewerPage,
      componentProps: { youtubeID: this.youtubeID },
      backdropDismiss: true,
      cssClass: "video-player-modal"
    });
    await modal.present();
  }
}
