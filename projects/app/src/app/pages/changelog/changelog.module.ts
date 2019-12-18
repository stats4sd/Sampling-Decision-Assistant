import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ChangelogPageRoutingModule } from "./changelog-routing.module";

import { ChangelogPage } from "./changelog.page";
import { GeneralComponentsModule } from "src/app/components/general/generalComponents.module";
import { StageComponentsModule } from "src/app/pages/tool/stage/content/stageComponents.module";
// import { ImageViewerModule } from "ngx-image-viewer";
import { NgxYoutubePlayerModule } from "ngx-youtube-player";
import { PageComponentsModule } from "src/app/components/page/pageComponentsModule";
import { ResourceComponentsModule } from "../resources/components/resourceComponents.module";

@NgModule({
  imports: [
    CommonModule,
    PageComponentsModule,
    FormsModule,
    IonicModule,
    ChangelogPageRoutingModule,
    GeneralComponentsModule,
    ResourceComponentsModule,
    StageComponentsModule,
    NgxYoutubePlayerModule
    // ImageViewerModule.forRoot({
    //   btnIcons: {
    //     zoomIn: "fa fa-plus",
    //     zoomOut: "fa fa-minus"
    //   }
    // })
  ],
  declarations: [ChangelogPage]
})
export class ChangelogPageModule {}
