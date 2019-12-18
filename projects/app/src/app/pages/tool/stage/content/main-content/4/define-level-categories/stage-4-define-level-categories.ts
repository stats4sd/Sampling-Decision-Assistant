import { Component, Input } from "@angular/core";
import { select } from "@angular-redux/store";
import { Observable, Subject } from "rxjs";
import { ReportingLevel } from "../../../../../../../models/models";
import { FormProvider } from "src/app/services";
import { takeUntil } from "rxjs/operators";

export interface ReportingLevel {
  name: string;
  classifications: LevelClassification;
}

export interface LevelClassification {
  names: string[];
  total: string;
}

@Component({
  selector: "stage-4-define-level-categories",
  templateUrl: "stage-4-define-level-categories.html",
  styleUrls: ["stage-4-define-level-categories.scss"]
})
export class Stage4_DefineLevelCategoriesComponent {
  removeSubscriptions$ = new Subject();
  @Input("reviewMode")
  reviewMode: boolean;
  reportingLevels: ReportingLevel[] = [];
  @select(["view", "params", "stagePart"])
  readonly slideSection$: Observable<string>;
  @select(["activeProject", "values", "reportingLevels"])
  readonly reportingLevels$: Observable<ReportingLevel[]>;

  constructor(private formPrvdr: FormProvider) {}
  ngOnInit() {
    // bind to reporting level changes to recalculate classification fields
    this.reportingLevels$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(levels => {
        if (levels instanceof Array) {
          this.reportingLevels = levels;
        }
      });
  }
  ngOnDestroy(): void {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
    // only save the name changes when leaving the section to avoid update bugs
    this.updateNames();
  }

  // change the current array of level classification data on change, adding placeholder on increase and removing existing on decrease
  setClassificationsNumber(level: ReportingLevel, levelIndex: number) {
    const total: number = parseInt(level.classifications.total);
    let names: string[] = level.classifications.names.slice();
    // case number increased - new names to be added
    if (names.length < total) {
      for (let i = names.length; i < total; i++) {
        names.push("");
      }
    }
    // case number decreased - names to be removed
    if (names.length > total) {
      names = names.slice(0, total);
    }
    this.reportingLevels[levelIndex].classifications.names = names;
    this.save(this.reportingLevels);
  }

  save(reportingLevels) {
    let patch: any = {};
    patch.reportingLevels = reportingLevels;
    this.formPrvdr.formGroup.patchValue(patch);
  }

  // iterate through each name input and update corresponding value on Disaggregation
  // note that we haven't used direct binding due to issues with how the values sometimes incorrectly update when
  // navigating between different inputs bound to json sub properties (#130)
  updateNames() {
    this.reportingLevels.forEach((level, i) => {
      level.classifications.names.forEach((name, j) => {
        let inputVal = document
          .getElementById("nameInput-" + i + "-" + j)
          .getElementsByTagName("input")[0].value;
        this.reportingLevels[i].classifications.names[j] = inputVal;
      });
    });
    this.save(this.reportingLevels);
  }
}
