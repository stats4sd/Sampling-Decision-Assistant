import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedInfoPage } from './saved-info';
import { FileDropModule } from 'ngx-file-drop';
import { GeneralComponentsModule } from '../../../components/general/generalComponents.module';

@NgModule({
  declarations: [
    SavedInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedInfoPage),
    FileDropModule,
    GeneralComponentsModule
  ],
})
export class SavedInfoPageModule {}
