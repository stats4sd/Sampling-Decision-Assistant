import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndicatorsPage } from './indicators';

@NgModule({
  declarations: [
    IndicatorsPage,
  ],
  imports: [
    IonicPageModule.forChild(IndicatorsPage),
  ],
})
export class IndicatorsPageModule {}
