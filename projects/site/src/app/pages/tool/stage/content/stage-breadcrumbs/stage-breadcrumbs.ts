import { Component, Input } from "@angular/core";
import { select, NgRedux } from "@angular-redux/store";
import { Subject, Subscription } from "rxjs";
import { ViewActions } from "../../../../../actions/actions";
import { AppState } from "../../../../../models/models";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "stage-breadcrumbs",
  templateUrl: "stage-breadcrumbs.html",
  styleUrls: ["stage-breadcrumbs.scss"]
})
export class StageBreadcrumbsComponent {
  @Input()
  set stage(stage: number) {
    this.breadcrumbs = this.stageBreadcrumbs[stage];
  }
  part$: Subscription;
  activePart: number;
  breadcrumbs: any = [];
  removeSubscriptions$: Subject<any> = new Subject();
  stageBreadcrumbs = {
    4: ["Intro", "Level Classifications", "Review"],
    5: ["Intro", "Sampling Stages", "Building Frames", "Sampling Weights"],
    6: ["Intro", "Sample Sizes", "Resource Allocation"]
  };

  constructor(
    private viewActions: ViewActions,
    private ngRedux: NgRedux<AppState>
  ) {
    console.log("stage breadcrumbs constructor");
    // clear stage part from old steps
    this.viewActions.updateView({ params: { stagePart: null } });
    // subscribe to stage part state changes
    this.part$ = this.ngRedux
      .select<number>(["view", "params", "stagePart"])
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(p => {
        this.activePart = p;
      });
  }
  ngOnDestroy(): void {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }

  goToPart(index) {
    this.viewActions.updateView({ params: { stagePart: index } });
  }
}
