import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObjectivesPage } from './objectives';
import {ComponentsModule} from '../../../components/components.module'

@NgModule({
  declarations: [
    ObjectivesPage,
  ],
  imports: [
    IonicPageModule.forChild(ObjectivesPage),
    ComponentsModule
  ],
})
export class ObjectivesPageModule {}
