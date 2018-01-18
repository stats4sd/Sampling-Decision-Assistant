import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StagePage } from './stage';
import { StageComponentsModule} from '../../../../components/stage-content/stageComponents.module'
import {ComponentsModule} from '../../../../components/components.module'

@NgModule({
  declarations: [
    StagePage,
  ],
  imports: [
    IonicPageModule.forChild(StagePage),
    StageComponentsModule,
    ComponentsModule
  ],
})
export class StagePageModule {}
