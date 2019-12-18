import { NgModule } from "@angular/core";
// import ionic module if plan to use ionic components
import { IonicModule } from "@ionic/angular";
import { GeneralComponentsModule } from "../../../../components/general/generalComponents.module";
import { SurveyComponentsModule } from "../../../../components/survey/survey-components.module";

import { StageCompleteComponent } from "./stage-complete/stage-complete";
import { StageBreadcrumbsComponent } from "./stage-breadcrumbs/stage-breadcrumbs";
import { Stage1Component } from "./main-content/1/stage-1";
import { Stage2Component } from "./main-content/2/stage-2";
import { Stage3Component } from "./main-content/3/stage-3";
import { Stage4Component } from "./main-content/4/stage-4";
import { Stage4_DefineLevelCategoriesComponent } from "./main-content/4/define-level-categories/stage-4-define-level-categories";
import { Stage4_ReviewLevelsComponent } from "./main-content/4/review-levels/stage-4-review-levels";
import { Stage5Component } from "./main-content/5/stage-5";
import { Stage5_FrameBuilderOverviewComponent } from "./main-content/5/frame-builder-overview/stage-5-frame-builder-overview";
import { Stage5_RecapComponent } from "./main-content/5/recap/stage-5-recap";
import { Stage5_DefineStagesComponent } from "./main-content/5/define-stages/stage-5-define-stages";
import { Stage5_SamplingWeightsComponent } from "./main-content/5/sampling-weights/stage-5-sampling-weights";
import { Stage6Component } from "./main-content/6/stage-6";
import { DataVisComponentsModule } from "../../../../components/dataVis/dataVisComponents.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    Stage1Component,
    Stage2Component,
    Stage3Component,
    Stage4Component,
    Stage4_DefineLevelCategoriesComponent,
    Stage4_ReviewLevelsComponent,
    Stage5Component,
    Stage5_FrameBuilderOverviewComponent,
    Stage5_RecapComponent,
    Stage5_DefineStagesComponent,
    Stage5_SamplingWeightsComponent,
    Stage6Component,
    StageCompleteComponent,
    StageBreadcrumbsComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    GeneralComponentsModule,
    SurveyComponentsModule,
    DataVisComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    Stage1Component,
    Stage2Component,
    Stage3Component,
    Stage4Component,
    Stage4_DefineLevelCategoriesComponent,
    Stage4_ReviewLevelsComponent,
    Stage5Component,
    Stage5_FrameBuilderOverviewComponent,
    Stage5_RecapComponent,
    Stage5_DefineStagesComponent,
    Stage5_SamplingWeightsComponent,
    Stage6Component,
    StageCompleteComponent,
    StageBreadcrumbsComponent
  ]
})
export class StageComponentsModule {}
