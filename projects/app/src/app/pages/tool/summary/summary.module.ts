import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SummaryPage } from "./summary.page";
import { PageComponentsModule } from "src/app/components/page/pageComponentsModule";
import { DataVisComponentsModule } from "src/app/components/dataVis/dataVisComponents.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageComponentsModule,
    DataVisComponentsModule
  ],
  declarations: [SummaryPage],
  entryComponents: [SummaryPage]
})
export class SummaryPageModule {}
