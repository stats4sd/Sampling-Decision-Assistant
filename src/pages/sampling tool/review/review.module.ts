import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewPage } from './review';
import {GeneralComponentsModule} from '../../../components/general/generalComponents.module'

@NgModule({
  declarations: [
    ReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewPage),
    GeneralComponentsModule
  ],
})
export class ReviewPageModule {}
