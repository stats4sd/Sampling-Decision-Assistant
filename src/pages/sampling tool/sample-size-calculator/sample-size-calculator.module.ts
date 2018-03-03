import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SampleSizeCalculatorPage } from './sample-size-calculator';
import { GeneralComponentsModule } from '../../../components/general/generalComponents.module';

@NgModule({
  declarations: [
    SampleSizeCalculatorPage,
  ],
  imports: [
    IonicPageModule.forChild(SampleSizeCalculatorPage),
    GeneralComponentsModule
  ],
})
export class SampleSizeCalculatorPageModule {}
