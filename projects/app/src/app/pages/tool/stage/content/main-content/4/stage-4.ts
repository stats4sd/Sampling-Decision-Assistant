import { Component } from "@angular/core";
import { StagePage } from "src/app/pages/tool/stage/stage.page";
import { select } from "@angular-redux/store";
import { Observable, Subject } from "rxjs";
import { ProjectValues } from "../../../../../../models/models";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "stage-4",
  templateUrl: "stage-4.html",
  styleUrls: ["stage-4.scss"]
})
export class Stage4Component extends StagePage {
  removeSubscriptions$ = new Subject();
  @select(["activeProject", "values", "q4.1"]) estimatesType$: Observable<
    string
  >;

  ngOnInit() {
    this.estimatesType$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(type => {
        if (type == "One estimate") {
          this.setSingleEstimate();
          this.clearReportingLevels();
        }
      });
  }
  ngOnDestroy(): void {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }

  // case where user has specified one estimate, want to automatically populate with indicator but still provide option to change
  setSingleEstimate() {
    const v: ProjectValues = this.ngRedux.getState().activeProject.values;
    if (v["q2.1.1"]) {
      if (!v["q4.3"] || v["q4.3"] == "") {
        let patch: ProjectValues = {};
        patch["q4.3"] = v["q2.1.1"];
        this.formPrvdr.formGroup.patchValue(patch);
      }
    }
  }

  // in case sample scheme changed to no longer use disaggregated results need to clear any saved dissagregations from each sampling stage
  clearReportingLevels() {
    const v: ProjectValues = this.ngRedux.getState().activeProject.values;
    if (v.samplingStages) {
      const stages = v.samplingStages.map(stage => {
        if (stage.hasOwnProperty("q5.3.4.2")) {
          stage["q5.3.4.2"] = null;
        }
        return stage;
      });
      this.formPrvdr.formGroup.patchValue({ samplingStages: stages });
      this.dataPrvdr.backgroundSave();
    }
  }
}
