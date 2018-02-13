import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StagePage } from './stage';
import { StageComponentsModule } from '../../../../components/stage-content/stageComponents.module'
import { SurveyComponentsModule } from '../../../../components/survey/survey-components.module'
import { GeneralComponentsModule } from '../../../../components/general/generalComponents.module'

@NgModule({
  declarations: [
    StagePage,
  ],
  imports: [
    IonicPageModule.forChild(StagePage),
    StageComponentsModule,
    SurveyComponentsModule,
    GeneralComponentsModule
  ],
})
export class StagePageModule { }
