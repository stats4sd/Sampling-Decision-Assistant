import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlossaryPage } from './glossary';
import {ComponentsModule} from '../../components/components.module'

@NgModule({
  declarations: [
    GlossaryPage,
  ],
  imports: [
    IonicPageModule.forChild(GlossaryPage),
    ComponentsModule
  ],
})
export class GlossaryPageModule {}
