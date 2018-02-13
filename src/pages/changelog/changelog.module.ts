import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangelogPage } from './changelog';
import {GeneralComponentsModule} from '../../components/general/generalComponents.module'
import {StageComponentsModule} from '../../components/stage-content/stageComponents.module'

@NgModule({
  declarations: [
    ChangelogPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangelogPage),
    GeneralComponentsModule,
    StageComponentsModule
  ],
})
export class ChangelogPageModule {}
