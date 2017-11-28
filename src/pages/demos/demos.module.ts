import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DemosPage } from './demos';

@NgModule({
  declarations: [
    DemosPage,
  ],
  imports: [
    IonicPageModule.forChild(DemosPage),
  ],
})
export class DemosPageModule {}
