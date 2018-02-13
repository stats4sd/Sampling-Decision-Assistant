import { NgModule } from '@angular/core';
// import ionic module if plan to use ionic components
import { IonicModule } from 'ionic-angular';
//  import reactive forms module
import { ReactiveFormsModule } from '@angular/forms';
// import drag/drop package
import {DragulaModule} from 'ng2-dragula'

import { SurveyQuestionComponent } from './survey-question/survey-question';
import { SurveyQuestionGroupComponent } from './survey-question-group/survey-question-group';
import { SurveyReferenceComponent } from './survey-reference/survey-reference';
import { SurveyRepeatGroupComponent } from './survey-repeat-group/survey-repeat-group';
import { SurveyLabelComponent } from './survey-label/survey-label';

// import { DecisionToolMenuComponent } from './decision-tool-menu/decision-tool-menu';
@NgModule({
    declarations: [
        SurveyQuestionComponent,
        SurveyQuestionGroupComponent,
        SurveyReferenceComponent,
        SurveyRepeatGroupComponent,
        SurveyLabelComponent,
    ],
    imports: [
        IonicModule,
        ReactiveFormsModule,
        DragulaModule
    ],
    exports: [
        SurveyQuestionComponent,
        SurveyQuestionGroupComponent,
        SurveyReferenceComponent,
        SurveyRepeatGroupComponent,
        SurveyLabelComponent,
    ]
})
export class SurveyComponentsModule { }
