import { NgModule } from '@angular/core';
// import ionic module if plan to use ionic components
import { IonicModule } from 'ionic-angular';
//  import reactive forms module
import { ReactiveFormsModule } from '@angular/forms';

import { SurveyQuestionComponent } from './survey/survey-question/survey-question';
import { SurveyQuestionGroupComponent } from './survey/survey-question-group/survey-question-group';
import { IntroductionComponent } from './introduction/introduction';
import { GlossaryLinkComponent } from './glossary/glossary-link/glossary-link';
import { GlossaryComponent } from './glossary/glossary';
import { HelpIconComponent } from './survey/help-icon/help-icon';
import { GlossaryDetailComponent } from './glossary/glossary-detail/glossary-detail';
import { WarningComponent } from './warning/warning';
import { SurveyReferenceComponent } from './survey/survey-reference/survey-reference';


// import { DecisionToolMenuComponent } from './decision-tool-menu/decision-tool-menu';
@NgModule({
    declarations: [
        SurveyQuestionComponent,
        SurveyQuestionGroupComponent,
        IntroductionComponent,
        GlossaryLinkComponent,
        GlossaryComponent,
        HelpIconComponent,
        GlossaryDetailComponent,
        WarningComponent,
        SurveyReferenceComponent,
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
        HelpIconComponent,
        GlossaryDetailComponent,
        WarningComponent,
        SurveyReferenceComponent,
    ]
})
export class ComponentsModule { }
