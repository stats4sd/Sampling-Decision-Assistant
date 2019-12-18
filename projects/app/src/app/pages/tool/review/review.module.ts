import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ReviewPageRoutingModule } from "./review-routing.module";

import { ReviewPage } from "./review.page";
import { GeneralComponentsModule } from "src/app/components/general/generalComponents.module";
import { SurveyComponentsModule } from "src/app/components/survey/survey-components.module";
import { StageComponentsModule } from "src/app/pages/tool/stage/content/stageComponents.module";
import { DataVisComponentsModule } from "src/app/components/dataVis/dataVisComponents.module";
import { PageComponentsModule } from "src/app/components/page/pageComponentsModule";
import { SummaryPageModule } from "../summary/summary.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewPageRoutingModule,
    PageComponentsModule,
    GeneralComponentsModule,
    SurveyComponentsModule,
    StageComponentsModule,
    DataVisComponentsModule,
    SummaryPageModule
  ],
  declarations: [ReviewPage]
})
export class ReviewPageModule {}
