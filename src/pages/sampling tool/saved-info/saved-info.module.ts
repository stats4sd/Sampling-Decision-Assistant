import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedInfoPage } from './saved-info';
import { FileDropModule } from 'ngx-file-drop';

@NgModule({
  declarations: [
    SavedInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedInfoPage),
    FileDropModule
  ],
})
export class SavedInfoPageModule {}
