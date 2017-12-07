import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StepByStepPage } from './step-by-step';

@NgModule({
  declarations: [
    StepByStepPage,
  ],
  imports: [
    IonicPageModule.forChild(StepByStepPage),
  ],
})
export class StepByStepPageModule {}
