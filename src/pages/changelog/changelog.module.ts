import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangelogPage } from './changelog';
import { GeneralComponentsModule } from '../../components/general/generalComponents.module'
import { StageComponentsModule } from '../../components/stage-content/stageComponents.module'
import { ImageViewerModule } from "ngx-image-viewer";


@NgModule({
  declarations: [
    ChangelogPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangelogPage),
    GeneralComponentsModule,
    StageComponentsModule,
    ImageViewerModule.forRoot({
      btnIcons: {
        zoomIn: 'fa fa-plus',
        zoomOut: 'fa fa-minus'
      }
    })
  ],
})
export class ChangelogPageModule { }
