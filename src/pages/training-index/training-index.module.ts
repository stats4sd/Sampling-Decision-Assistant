import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainingIndexPage } from './training-index';

@NgModule({
  declarations: [
    TrainingIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(TrainingIndexPage),
  ],
})
export class TrainingIndexPageModule {}
