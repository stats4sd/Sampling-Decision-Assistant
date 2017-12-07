import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedInfoPage } from './saved-info';

@NgModule({
  declarations: [
    SavedInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedInfoPage),
  ],
})
export class SavedInfoPageModule {}
