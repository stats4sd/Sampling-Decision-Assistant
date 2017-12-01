import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndicatorsPage } from './indicators';
import {ComponentsModule} from '../../../components/components.module'

@NgModule({
  declarations: [
    IndicatorsPage,
  ],
  imports: [
    IonicPageModule.forChild(IndicatorsPage),
    ComponentsModule
  ],
})
export class IndicatorsPageModule {}
