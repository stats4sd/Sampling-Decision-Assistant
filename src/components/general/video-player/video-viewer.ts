import { Component, Input } from "@angular/core";
import { IonicPage, NavParams, ViewController } from "ionic-angular";

// this is a simple page for the modal to contain
@IonicPage()
@Component({
  selector: "page-video-viewer",
  template: `
  <ion-header>
    <ion-navbar #navbar color="primary">
      <ion-buttons end>
      <button ion-button clear (click)="dismiss()" icon-only>
        <ion-icon name="close"></ion-icon>
      </button>
      </ion-buttons>
    </ion-navbar>
  </ion-header>
  <ion-content >
    <youtube-player [videoId]="youtubeID" [width]="videoPlayerWidth" [height]="videoPlayerHeight"></youtube-player>
  </ion-content>
  `
})
export class VideoViewerPage {
  @Input("youtubeID")
  youtubeID: string;
  videoPlayerWidth: number;
  videoPlayerHeight: number;
  constructor(params: NavParams, private viewCtrl: ViewController) {
    console.log("hello video view component", params.data);
    this.youtubeID = params.data.youtubeID;
  }
  ngOnInit() {
    this.videoPlayerWidth = Math.min(window.innerWidth, 600);
    this.videoPlayerHeight = Math.round((this.videoPlayerWidth / 16) * 9);
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
