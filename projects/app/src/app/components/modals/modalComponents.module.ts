import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { IonicModule } from "@ionic/angular";

import { FormsModule } from "@angular/forms";
import { GeneralComponentsModule } from "../general/generalComponents.module";
import { NgxFileDropModule } from "ngx-file-drop";
// Components
import { DecisionToolMenuComponent } from "./decision-tool-menu/decision-tool-menu";
import { SavedInfoComponent } from "./saved-info/saved-info.component";
import { PageComponentsModule } from "../page/pageComponentsModule";

// NOTE - modal components must be imported into root app to make aware of available
// entry components
const modals = [SavedInfoComponent, DecisionToolMenuComponent];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxFileDropModule,
    GeneralComponentsModule,
    PageComponentsModule
  ],
  declarations: modals,
  exports: modals,
  entryComponents: modals
})
export class ModalComponentsModule {}
