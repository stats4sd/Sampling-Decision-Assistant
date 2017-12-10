import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroductionTextPage } from './introduction-text';
import { ComponentsModule} from '../../components.module'



@NgModule({
  declarations: [
    IntroductionTextPage,
  ],
  imports: [
    IonicPageModule.forChild(IntroductionTextPage),
    ComponentsModule

  ],
})
export class IntroductionTextPageModule {}
