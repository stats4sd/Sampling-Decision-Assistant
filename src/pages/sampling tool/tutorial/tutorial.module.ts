import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TutorialPage } from "./tutorial";
import { GeneralComponentsModule } from "../../../components/general/generalComponents.module";

@NgModule({
  declarations: [TutorialPage],
  imports: [IonicPageModule.forChild(TutorialPage), GeneralComponentsModule]
})
export class TutorialPageModule {}
