import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ToolPageRoutingModule } from "./tool-routing.module";
import { GeneralComponentsModule } from "src/app/components/general/generalComponents.module";
import { ToolPage } from "./tool.page";
import { ModalComponentsModule } from "src/app/components/modals/modalComponents.module";
import { PageComponentsModule } from "src/app/components/page/pageComponentsModule";
import { CustomScrollbarModule } from "src/app/directives/customScrollbar.directive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ToolPageRoutingModule,
    PageComponentsModule,
    GeneralComponentsModule,
    ModalComponentsModule,
    PageComponentsModule,
    CustomScrollbarModule
  ],
  declarations: [ToolPage]
})
export class ToolPageModule {}
