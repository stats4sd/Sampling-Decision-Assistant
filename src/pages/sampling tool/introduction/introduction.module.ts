import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroductionPage } from './introduction';
import { GeneralComponentsModule } from '../../../components/general/generalComponents.module';

@NgModule({
  declarations: [
    IntroductionPage,
  ],
  imports: [
    IonicPageModule.forChild(IntroductionPage),
    GeneralComponentsModule
  ],
})
export class IntroductionPageModule {}
