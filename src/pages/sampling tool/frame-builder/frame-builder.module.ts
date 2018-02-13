import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FrameBuilderPage } from './frame-builder';
import { GeneralComponentsModule } from '../../../components/general/GeneralComponents.module'
import {SurveyComponentsModule} from '../../../components/survey/survey-components.module'

@NgModule({
  declarations: [
    FrameBuilderPage,
  ],
  imports: [
    IonicPageModule.forChild(FrameBuilderPage),
    GeneralComponentsModule,
    SurveyComponentsModule
  ],
})
export class FrameBuilderPageModule {}
