import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ResourcesPage } from "./resources";
import { GeneralComponentsModule } from "../../components/general/generalComponents.module";

@NgModule({
  declarations: [ResourcesPage],
  imports: [IonicPageModule.forChild(ResourcesPage), GeneralComponentsModule]
})
export class ResourcesPageModule {}
