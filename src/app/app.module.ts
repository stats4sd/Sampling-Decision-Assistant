// core
// animations
import { AnimatorModule } from "css-animator";
// menu
import { DecisionToolMenuComponent } from "../components/general/decision-tool-menu/decision-tool-menu";
// redux


@NgModule({
  declarations: [MyApp, DecisionToolMenuComponent],
  imports: [
    AnimatorModule,
  ],
  entryComponents: [MyApp, DecisionToolMenuComponent],
  providers: []
})
