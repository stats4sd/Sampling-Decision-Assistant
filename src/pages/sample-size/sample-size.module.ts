import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SampleSizePage } from './sample-size';

@NgModule({
  declarations: [
    SampleSizePage,
  ],
  imports: [
    IonicPageModule.forChild(SampleSizePage),
  ],
})
export class SampleSizePageModule {}
