import { NgModule } from "@angular/core";
// import ionic module if plan to use ionic components
import { IonicModule } from "@ionic/angular";
//  import reactive forms module
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
// import drag/drop package
import { DragulaModule } from "ng2-dragula";
// import custom pipes
import { PipesModule } from "../../pipes/pipes.module";
// import general components
import { GeneralComponentsModule } from "../general/generalComponents.module";

import { SurveyQuestionComponent } from "./survey-question/survey-question";
import { SurveyQuestionGroupComponent } from "./survey-question-group/survey-question-group";
import { SurveyReferenceComponent } from "./survey-reference/survey-reference";
import { SurveyRepeatGroupComponent } from "./survey-repeat-group/survey-repeat-group";
import { SurveyLabelComponent } from "./survey-label/survey-label";
// additional custom question types
import { QuestionCustomStrataSelectComponent } from "./question-types/custom-strata-select/question-custom-strata-select";
import { QuestionCustomStagesDefineComponent } from "./question-types/custom-stages-define/question-custom-stages-define";
import { QuestionCustomReportingLevelsComponent } from "./question-types/custom-reporting-levels/question-custom-reporting-levels";
import { QuestionTextMultipleComponent } from "./question-types/text-multiple/question-text-multiple";
import { CommonModule } from "@angular/common";
import { PageComponentsModule } from "../page/pageComponentsModule";

@NgModule({
  declarations: [
    SurveyQuestionComponent,
    SurveyQuestionGroupComponent,
    SurveyReferenceComponent,
    SurveyRepeatGroupComponent,
    SurveyLabelComponent,
    QuestionCustomStrataSelectComponent,
    QuestionCustomStagesDefineComponent,
    QuestionCustomReportingLevelsComponent,
    QuestionTextMultipleComponent
  ],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    PageComponentsModule,
    // NOTE - Dragula needs extra config to work, see:
    // https://github.com/valor-software/ng2-dragula/issues/849
    // (currently in tsconfig.app.json)
    DragulaModule.forRoot(),
    PipesModule,
    GeneralComponentsModule
  ],
  exports: [
    SurveyQuestionComponent,
    SurveyQuestionGroupComponent,
    SurveyReferenceComponent,
    SurveyRepeatGroupComponent,
    SurveyLabelComponent,
    QuestionCustomStrataSelectComponent,
    QuestionCustomStagesDefineComponent,
    QuestionCustomReportingLevelsComponent,
    QuestionTextMultipleComponent
  ]
})
export class SurveyComponentsModule {}
