import { Component, Input } from "@angular/core";
import { select, NgRedux } from "@angular-redux/store";
import { Subject, Subscription } from "rxjs";
import { ViewActions } from "../../../actions/actions";
import { AppState } from "../../../models/models";

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
  part$: Subscription;
  activePart: number;
  breadcrumbs: any = [];
  componentDestroyed: Subject<any> = new Subject();
  stageBreadcrumbs = {
    4: ["Intro", "Level Classifications and Strata", "Review"],
    5: ["Intro", "Sampling Stages", "Building Frames", "Sampling Weights"],
    6: ["Intro", "Sample Sizes", "Resource Allocation"]
  };

  constructor(
    private viewActions: ViewActions,
    private ngRedux: NgRedux<AppState>
  ) {
    this.part$ = this.ngRedux
      .select<number>(["view", "params", "stagePart"])
      .takeUntil(this.componentDestroyed)
      .subscribe(p => {
        this.activePart = p;
      });
  }
  ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

  goToPart(index) {
    this.viewActions.updateView({ params: { stagePart: index } });
  }
}
