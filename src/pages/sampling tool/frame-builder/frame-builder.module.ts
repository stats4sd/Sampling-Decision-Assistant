import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FrameBuilderPage } from './frame-builder';
import { ComponentsModule } from '../../../components/components.module'

@NgModule({
  declarations: [
    FrameBuilderPage,
  ],
  imports: [
    IonicPageModule.forChild(FrameBuilderPage),
    ComponentsModule
  ],
})
export class FrameBuilderPageModule {}
