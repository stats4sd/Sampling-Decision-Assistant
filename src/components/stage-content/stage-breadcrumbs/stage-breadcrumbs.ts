import { Component, Input } from "@angular/core";
import { CustomRouterProvider } from "../../../providers/router/router";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";

@Component({
  selector: "stage-breadcrumbs",
  templateUrl: "stage-breadcrumbs.html"
})
export class StageBreadcrumbsComponent {
  @Input()
  set stage(stage: number) {
    this.breadcrumbs = this.stageBreadcrumbs[stage];
  }
  @Input("stageSlidesIndex")
  stageSlidesIndex: number;
  @select(["view", "params", "stagePart"])
  part$: Observable<number>;
  activePart: number;
  breadcrumbs: any = [];
  stageBreadcrumbs = {
    4: ["Intro", "Level Classifications and Strata", "Review"],
    5: ["Intro", "Sampling Stages", "Building Frames"],
    6: ["Intro", "Stratification", "Sample Sizes", "Resource Allocation"]
  };

  constructor(private customRouter: CustomRouterProvider) {
    this.part$.subscribe(p => (this.activePart = p));
  }

  goToPart(index) {
    // unlock nav params if locked (#114)
    this.customRouter.unlockHash();
    if (index == 0) {
      this.customRouter.removeHashParam("stagePart");
    } else {
      this.customRouter.updateHashParams({ stagePart: index });
    }
  }
}
