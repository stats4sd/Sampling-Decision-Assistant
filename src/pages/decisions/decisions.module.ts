import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DecisionsPage } from './decisions';

@NgModule({
  declarations: [
    DecisionsPage,
  ],
  imports: [
    IonicPageModule.forChild(DecisionsPage),
  ],
})
export class DecisionsPageModule {}
