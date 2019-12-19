import { Component, Input } from "@angular/core";
import { NgRedux, select } from "@angular-redux/store";
import { Subject, Subscription, Observable } from "rxjs";
import {
  StageMeta,
  AppState,
  ReportingLevel,
  IAllocation
} from "../../../../models/models";
import { CalculatorRecommendations } from "../../sample-size-calculator/sample-size-calculator";
import { DataVisProvider } from "src/app/services/data-vis/data-vis";
import { DataProvider } from "src/app/services/data/data";
import { FormProvider } from "src/app/services/form/form";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "tree-table",
  templateUrl: "tree-table.html",
  styleUrls: ["./tree-table.scss"]
})
export class TreeTableComponent {
  @Input() exportMode: boolean;
  samplingStages: StageMeta[] = [];
  allocationSampleSize: number = -1;
  stageStrata: string[][];
  disaggregationMeta: {
    reportingLevels: ReportingLevel[];
    levelCombinations: string[];
  };
  recommendations$: Subscription;
  recommendations: CalculatorRecommendations;
  private removeSubscriptions$: Subject<any> = new Subject();

  constructor(
    private ngRedux: NgRedux<AppState>,
    public dataVisPrvdr: DataVisProvider,
    private dataPrvdr: DataProvider,
    private formPrvdr: FormProvider
  ) {
    console.log("tree table constructor");
    this._addSubscribers();
  }

  ngOnDestroy() {
    // want to remove subscriptions on destroy (note automatically handled for @select bound to async pipe in html)
    // using subject emits value manually (like event emitter) by calling the 'next()' function
    // on destroy we want to emit any value so that the takeUntil subscription records it no longer needs to subscribe
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }

  // check .allocation values control exist, create if doesn't using recommendation and allocated values
  updateAllocation() {
    const allocation: IAllocation = {
      aggregationSampleSize: this.allocationSampleSize,
      totalSampleSize:
        this.allocationSampleSize *
        this.recommendations.disaggregationMeta.levelCombinations.length,
      recommendedAggregationSize: this.recommendations.requiredPerAggregation,
      recommendedTotalSampleSize: this.recommendations.totalSampleSize
    };
    if (!this.formPrvdr.formGroup.controls._allocation) {
      this.formPrvdr.formGroup.addControl(
        "_allocation",
        this.formPrvdr.fb.control(allocation)
      );
    } else {
      this.formPrvdr.formGroup.patchValue({ _allocation: allocation });
    }
  }

  allocationChange(e, index) {
    // convert strings back to number (will fire change event again)
    if (typeof e._value == "string") {
      this.samplingStages[index].sampleSize = Number(e._value);
    } else {
      this.calculateAllocationSampleSize();
      this.formPrvdr.formGroup.patchValue({
        samplingStages: this.samplingStages
      });
      this.updateAllocation();
      this.dataPrvdr.backgroundSave();
    }
  }
  calculateAllocationSampleSize() {
    this.allocationSampleSize = this.samplingStages
      .map(s => (s.sampleSize ? s.sampleSize : 0))
      .reduce((a, b) => a * b);
  }

  // for each stage want the total reporting combinations to allocate from the sample
  // adds _reportingLevels and _stageStrata properties, could be done at earlier stage (e.g. when building tree nodes)
  // *** note, currently strata names simply listed so don't need full combinations (would be useful if allowing more allocation)
  getStageStrata(stages: StageMeta[] = []) {
    console.log("get stage strata", stages);
    stages = stages.map(s => {
      if (s["q5.3.4.2"] && s["q5.3.4.2"].length > 0) {
        s._reportingLevels = s["q5.3.4.2"].map(level =>
          this.getReportingLevel(level)
        );
        const classifications = [];
        s._reportingLevels.forEach(l =>
          classifications.push(l.classifications.names)
        );
        s._stageStrata = this.dataVisPrvdr._buildCombinations(classifications);
      }
      return s;
    });
    return stages;
  }

  getReportingLevel(name: string) {
    try {
      const allReportingLevels = this.ngRedux.getState().activeProject.values
        .reportingLevels;
      const level: ReportingLevel = allReportingLevels.filter(
        l => l.name == name
      )[0];
      return level;
    } catch (error) {
      console.error("could not match level", name);
      // could not match level
    }
  }

  _addSubscribers() {
    // use 'takeuntil' to use second observable as an argument. This is only emitted on destruction
    this.recommendations$ = this.ngRedux
      .select<CalculatorRecommendations>([
        "activeProject",
        "values",
        "_calculatorVars",
        "recommendations"
      ])
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(recommendations => {
        if (recommendations) {
          console.log("recommendations updated");
          this.recommendations = recommendations;
          // trigger stages update too
          const stages = this.ngRedux.getState().activeProject.values
            .samplingStages;
          if (stages) {
            this.samplingStages = this.getStageStrata(stages);
            this.calculateAllocationSampleSize();
          }
        }
      });
  }
}
