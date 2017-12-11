import { NgModule } from '@angular/core';
// import ionic module if plan to use ionic components
import { IonicModule } from 'ionic-angular';
//  import reactive forms module
import { ReactiveFormsModule } from '@angular/forms';

import { SurveyQuestionComponent } from './survey-question/survey-question';
import { SurveyQuestionGroupComponent } from './survey-question-group/survey-question-group';
import { IntroductionComponent } from './introduction/introduction';
import { GlossaryLinkComponent } from './glossary-link/glossary-link';
import { GlossaryComponent } from './glossary/glossary';
@NgModule({
    declarations: [
        SurveyQuestionComponent,
        SurveyQuestionGroupComponent,
        IntroductionComponent,
    GlossaryLinkComponent,
    GlossaryComponent,
    ],
    imports: [
        IonicModule,
        ReactiveFormsModule,
    ],
    exports: [
        SurveyQuestionComponent,
        SurveyQuestionGroupComponent,
        IntroductionComponent,
    GlossaryLinkComponent,
    GlossaryComponent,
    ]
})
export class ComponentsModule { }
