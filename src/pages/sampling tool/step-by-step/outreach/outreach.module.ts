import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OutreachPage } from './outreach';
import {ComponentsModule} from '../../../../components/components.module'

@NgModule({
  declarations: [
    OutreachPage,
  ],
  imports: [
    IonicPageModule.forChild(OutreachPage),
    ComponentsModule
  ],
})
export class OutreachPageModule {}
