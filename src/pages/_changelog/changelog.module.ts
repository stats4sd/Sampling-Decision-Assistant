import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangelogPage } from './changelog';
import {ComponentsModule} from '../../components/components.module'
import {StageComponentsModule} from '../../components/stage-content/stageComponents.module'

@NgModule({
  declarations: [
    ChangelogPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangelogPage),
    ComponentsModule,
    StageComponentsModule
  ],
})
export class ChangelogPageModule {}
