import { NgModule } from "@angular/core";
// import ionic module if plan to use ionic components
import { IonicModule } from "ionic-angular";
import { IntroductionComponent } from "./introduction/introduction";
import { GlossaryLinkComponent } from "./glossary/glossary-link/glossary-link";
import { GlossaryListComponent } from "./glossary/glossary-list";
import { GlossaryDetailComponent } from "./glossary/glossary-detail/glossary-detail";
import { NoteComponent } from "./note/note";
import { ResourceItemComponent } from "./resources/resource-item/resource-item";
import { ResourcesListComponent } from "./resources/resources-list/resources-list";
import { HelpIconComponent } from "./help-icon/help-icon";
import { YoutubePlayerModule } from "ngx-youtube-player";
import { ProjectTitleComponent } from "./project-title";
import { VideoPopupButtonComponent } from "./video-player/video-popup-button";

// import { DecisionToolMenuComponent } from './decision-tool-menu/decision-tool-menu';
@NgModule({
  declarations: [
    IntroductionComponent,
    GlossaryLinkComponent,
    GlossaryListComponent,
    GlossaryDetailComponent,
    NoteComponent,
    ResourcesListComponent,
    ResourceItemComponent,
    HelpIconComponent,
    ProjectTitleComponent,
    VideoPopupButtonComponent
  ],
  imports: [IonicModule, YoutubePlayerModule],
  exports: [
    IntroductionComponent,
    GlossaryLinkComponent,
    GlossaryListComponent,
    GlossaryDetailComponent,
    NoteComponent,
    ResourcesListComponent,
    ResourceItemComponent,
    HelpIconComponent,
    ProjectTitleComponent,
    VideoPopupButtonComponent
  ]
})
export class GeneralComponentsModule {}
