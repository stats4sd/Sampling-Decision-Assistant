import { NgModule } from "@angular/core";
// import ionic module if plan to use ionic components
import { IonicModule } from "@ionic/angular";
import { IntroductionComponent } from "./introduction/introduction";
import { GlossaryLinkComponent } from "./glossary/glossary-link/glossary-link";
import { GlossaryListComponent } from "./glossary/glossary-list";
import { GlossaryDetailComponent } from "./glossary/glossary-detail/glossary-detail";
import { NoteComponent } from "./note/note";
import { HelpIconComponent, InfoIconComponent } from "./icons";
import { NgxYoutubePlayerModule } from "ngx-youtube-player";
import { VideoPopupButtonComponent } from "./video-player/video-popup-button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { IntroductionTextPage } from "./introduction/introduction-text/introduction-text";
import { VideoViewerPage } from "./video-player/video-viewer";
import { PageComponentsModule } from "../page/pageComponentsModule";

@NgModule({
  declarations: [
    IntroductionComponent,
    IntroductionTextPage,
    GlossaryLinkComponent,
    GlossaryListComponent,
    GlossaryDetailComponent,
    NoteComponent,
    HelpIconComponent,
    InfoIconComponent,
    VideoPopupButtonComponent,
    VideoViewerPage
  ],
  imports: [
    IonicModule,
    NgxYoutubePlayerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PageComponentsModule
  ],
  exports: [
    IntroductionComponent,
    IntroductionTextPage,
    GlossaryLinkComponent,
    GlossaryListComponent,
    GlossaryDetailComponent,
    NoteComponent,
    HelpIconComponent,
    InfoIconComponent,
    VideoPopupButtonComponent,
    VideoViewerPage
  ],
  entryComponents: [IntroductionTextPage, VideoViewerPage]
})
export class GeneralComponentsModule {}
