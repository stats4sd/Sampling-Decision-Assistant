import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewPage } from './review';
import {GeneralComponentsModule} from '../../../components/general/generalComponents.module'
import { SurveyComponentsModule } from '../../../components/survey/survey-components.module';

@NgModule({
  declarations: [
    ReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewPage),
    GeneralComponentsModule,
    SurveyComponentsModule
  ],
})
export class ReviewPageModule {}
