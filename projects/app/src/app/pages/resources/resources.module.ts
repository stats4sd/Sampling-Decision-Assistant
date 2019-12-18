import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ResourcesPageRoutingModule } from "./resources-routing.module";

import { ResourcesPage } from "./resources.page";
import { GeneralComponentsModule } from "src/app/components/general/generalComponents.module";
import { ResourceComponentsModule } from "./components/resourceComponents.module";
import { PageComponentsModule } from "src/app/components/page/pageComponentsModule";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageComponentsModule,
    ResourcesPageRoutingModule,
    GeneralComponentsModule,
    ResourceComponentsModule
  ],
  declarations: [ResourcesPage]
})
export class ResourcesPageModule {}
