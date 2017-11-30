import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObjectivesPage } from './objectives';

@NgModule({
  declarations: [
    ObjectivesPage,
  ],
  imports: [
    IonicPageModule.forChild(ObjectivesPage),
  ],
})
export class ObjectivesPageModule {}
