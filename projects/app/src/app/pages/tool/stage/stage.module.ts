import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { StagePageRoutingModule } from "./stage-routing.module";

import { StagePage } from "./stage.page";
import { StageComponentsModule } from "src/app/pages/tool/stage/content/stageComponents.module";
import { SurveyComponentsModule } from "src/app/components/survey/survey-components.module";
import { GeneralComponentsModule } from "src/app/components/general/generalComponents.module";
import { PageComponentsModule } from "src/app/components/page/pageComponentsModule";
import { FrameBuilderPageModule } from "../frame-builder/frame-builder.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PageComponentsModule,
    StagePageRoutingModule,
    StageComponentsModule,
    SurveyComponentsModule,
    GeneralComponentsModule,
    FrameBuilderPageModule
  ],
  declarations: [StagePage]
})
export class StagePageModule {}
