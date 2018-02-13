import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlossaryPage } from './glossary';
import {GeneralComponentsModule} from '../../components/general/generalComponents.module'

@NgModule({
  declarations: [
    GlossaryPage,
  ],
  imports: [
    IonicPageModule.forChild(GlossaryPage),
    GeneralComponentsModule
  ],
})
export class GlossaryPageModule {}
