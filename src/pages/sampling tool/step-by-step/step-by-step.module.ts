import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StepByStepPage } from './step-by-step';
import { GeneralComponentsModule} from '../../../components/general/generalComponents.module'

@NgModule({
  declarations: [
    StepByStepPage,
  ],
  imports: [
    IonicPageModule.forChild(StepByStepPage),
    GeneralComponentsModule
  ],
})
export class StepByStepPageModule {}
