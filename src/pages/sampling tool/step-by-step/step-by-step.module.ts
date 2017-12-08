import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StepByStepPage } from './step-by-step';
import { ComponentsModule} from '../../../components/components.module'

@NgModule({
  declarations: [
    StepByStepPage,
  ],
  imports: [
    IonicPageModule.forChild(StepByStepPage),
    ComponentsModule
  ],
})
export class StepByStepPageModule {}
