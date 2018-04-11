import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminPage } from './admin';
import { GeneralComponentsModule } from '../../../components/general/generalComponents.module';
import { DevComponentsModule } from '../../../components/_dev/dev.components.module';

@NgModule({
  declarations: [
    AdminPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminPage),
    GeneralComponentsModule,
    DevComponentsModule
  ],
})
export class AdminPageModule {}
