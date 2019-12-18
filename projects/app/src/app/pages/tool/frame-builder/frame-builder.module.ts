import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { FrameBuilderPage } from "./frame-builder.page";
import { SurveyComponentsModule } from "src/app/components/survey/survey-components.module";
import { GeneralComponentsModule } from "src/app/components/general/generalComponents.module";
import { PageComponentsModule } from "src/app/components/page/pageComponentsModule";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PageComponentsModule,
    GeneralComponentsModule,
    SurveyComponentsModule
  ],
  declarations: [FrameBuilderPage],
  entryComponents: [FrameBuilderPage]
})
export class FrameBuilderPageModule {}
