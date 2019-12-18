import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { GlossaryPageRoutingModule } from "./glossary-routing.module";

import { GlossaryPage } from "./glossary.page";
import { GeneralComponentsModule } from "src/app/components/general/generalComponents.module";
import { PageComponentsModule } from "src/app/components/page/pageComponentsModule";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageComponentsModule,
    GlossaryPageRoutingModule,
    GeneralComponentsModule
  ],
  declarations: [GlossaryPage]
})
export class GlossaryPageModule {}
