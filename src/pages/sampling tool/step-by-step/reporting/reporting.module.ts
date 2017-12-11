import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportingPage } from './reporting';
import {ComponentsModule} from '../../../../components/components.module'

@NgModule({
  declarations: [
    ReportingPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportingPage),
    ComponentsModule
  ],
})
export class ReportingPageModule {}
