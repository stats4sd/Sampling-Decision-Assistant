import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DecisionsPage } from './decisions';
import {ComponentsModule} from '../../../../components/components.module'

@NgModule({
  declarations: [
    DecisionsPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionsPage),
    ComponentsModule
  ],
})
export class DecisionsPageModule {}
