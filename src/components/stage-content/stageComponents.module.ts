import { NgModule } from '@angular/core';
// import ionic module if plan to use ionic components
import { IonicModule } from 'ionic-angular';
import { GeneralComponentsModule } from '../general/generalComponents.module';
import { SurveyComponentsModule } from '../survey/survey-components.module'

import { StageIntroComponent } from './intro-sections/stage-intro';
import { StageCompleteComponent } from './stage-complete/stage-complete';
import { StageBreadcrumbsComponent } from './stage-breadcrumbs/stage-breadcrumbs'
import { Stage1Component } from './main-content/1/stage-1';
import { Stage2Component } from './main-content/2/stage-2';
import { Stage3Component } from './main-content/3/stage-3';
import { Stage4Component } from './main-content/4/stage-4';
import { Stage4_DefineLevelCategoriesComponent } from './main-content/4/define-level-categories/stage-4-define-level-categories'
import { Stage5Component } from './main-content/5/stage-5';
import { Stage5_FrameBuilderOverviewComponent } from './main-content/5/frame-builder-overview/stage-5-frame-builder-overview';
import { Stage5_RecapComponent } from './main-content/5/recap/stage-5-recap';
import { Stage5_DefineStagesComponent } from './main-content/5/define-stages/stage-5-define-stages';
import { Stage6Component } from './main-content/6/stage-6';

// import { DecisionToolMenuComponent } from './decision-tool-menu/decision-tool-menu';
@NgModule({
    declarations: [
        Stage1Component,
        Stage2Component,
        Stage3Component,
        Stage4Component,
        Stage4_DefineLevelCategoriesComponent,
        Stage5Component,
        Stage5_FrameBuilderOverviewComponent,
        Stage5_RecapComponent,
        Stage5_DefineStagesComponent,
        Stage6Component,
        StageIntroComponent,
        StageCompleteComponent,
        StageBreadcrumbsComponent
    ],
    imports: [
        IonicModule,
        GeneralComponentsModule,
        SurveyComponentsModule
    ],
    exports: [
        Stage1Component,
        Stage2Component,
        Stage3Component,
        Stage4Component,
        Stage4_DefineLevelCategoriesComponent,
        Stage5Component,
        Stage5_FrameBuilderOverviewComponent,
        Stage5_RecapComponent,
        Stage5_DefineStagesComponent,
        Stage6Component,
        StageIntroComponent,
        StageCompleteComponent,
        StageBreadcrumbsComponent
    ]
})
export class StageComponentsModule { }
