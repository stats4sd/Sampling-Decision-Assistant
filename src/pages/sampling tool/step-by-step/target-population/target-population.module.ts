import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TargetPopulationPage } from './target-population';
import {ComponentsModule} from '../../../../components/components.module'

@NgModule({
  declarations: [
    TargetPopulationPage,
  ],
  imports: [
    IonicPageModule.forChild(TargetPopulationPage),
    ComponentsModule
  ],
})
export class TargetPopulationPageModule {}
