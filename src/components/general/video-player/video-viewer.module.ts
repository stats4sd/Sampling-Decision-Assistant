import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { VideoViewerPage } from "./video-viewer";
import { YoutubePlayerModule } from "ngx-youtube-player";

@NgModule({
  declarations: [VideoViewerPage],
  imports: [IonicPageModule.forChild(VideoViewerPage), YoutubePlayerModule]
})
export class HomePageModule {}
