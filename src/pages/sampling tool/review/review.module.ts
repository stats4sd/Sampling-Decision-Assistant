import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewPage } from './review';
import {GeneralComponentsModule} from '../../../components/general/generalComponents.module'
import { SurveyComponentsModule } from '../../../components/survey/survey-components.module';
import { StageComponentsModule } from '../../../components/stage-content/stageComponents.module';
import { DataVisComponentsModule } from '../../../components/dataVis/dataVisComponents.module';

@NgModule({
  declarations: [
    ReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewPage),
    GeneralComponentsModule,
    SurveyComponentsModule,
    StageComponentsModule,
    DataVisComponentsModule
  ],
})
export class ReviewPageModule {}
