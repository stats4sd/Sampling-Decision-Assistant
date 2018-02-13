import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroductionTextPage } from './introduction-text';
import { GeneralComponentsModule} from '../../generalComponents.module'



@NgModule({
  declarations: [
    IntroductionTextPage,
  ],
  imports: [
    IonicPageModule.forChild(IntroductionTextPage),
    GeneralComponentsModule

  ],
})
export class IntroductionTextPageModule {}
