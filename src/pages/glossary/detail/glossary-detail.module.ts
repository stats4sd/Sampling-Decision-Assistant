import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlossaryDetailPage } from './glossary-detail';

@NgModule({
  declarations: [
    GlossaryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(GlossaryDetailPage),
  ],
})
export class GlossaryDetailPageModule {}
