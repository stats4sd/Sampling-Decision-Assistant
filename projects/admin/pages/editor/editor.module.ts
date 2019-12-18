import { NgModule } from '@angular/core';
import { IonicPageModule } from '@ionic/angular';
import { EditorPage } from './editor';
import { DevComponentsModule } from '../../../components/_dev/dev.components.module';

@NgModule({
  declarations: [
    EditorPage,
  ],
  imports: [
    IonicPageModule.forChild(EditorPage),
    DevComponentsModule
  ],
})
export class EditorPageModule {}
