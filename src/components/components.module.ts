import { NgModule } from '@angular/core';
// import ionic module if plan to use ionic components
import { IonicModule } from 'ionic-angular';
//  import reactive forms module
import { ReactiveFormsModule }          from '@angular/forms';

import { SurveyQuestionComponent } from './survey-question/survey-question';
import { SurveyQuestionGroupComponent } from './survey-question-group/survey-question-group';
import { IntroductionComponent } from './introduction/introduction';
@NgModule({
	declarations: [SurveyQuestionComponent,
    SurveyQuestionGroupComponent,
    IntroductionComponent,
    ],
	imports: [IonicModule, ReactiveFormsModule],
	exports: [SurveyQuestionComponent,
    SurveyQuestionGroupComponent,
    IntroductionComponent,
    ]
})
export class ComponentsModule {}
