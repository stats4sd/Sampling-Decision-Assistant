import { Component } from "@angular/core";
import { Stage4Component } from "../stage-4";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { ReportingLevel } from "../../../../../models/models";

@Component({
  selector: "stage-4-review-levels",
  templateUrl: "stage-4-review-levels.html"
})
export class Stage4_ReviewLevelsComponent extends Stage4Component {
  levelCombinations: any[] = [];
  reportingLevels: ReportingLevel[] = [];

  @select(["view", "params", "stagePart"])
  readonly slideSection$: Observable<string>;

  ngOnInit() {
    // bind to slide section to call init every time slide focused. use slice to avoid additional unwanted bindings
    this.slideSection$.subscribe(section => {
      if (
        section == "2" &&
        this.form.value &&
        this.form.value.reportingLevels
      ) {
        // *** slightly untidy code due to data vis provider refactor, could be tidies
        const disaggregationMeta = this.dataVisPrvdr.getReportingLevels();
        this.levelCombinations = disaggregationMeta.levelCombinations;
        this.reportingLevels = disaggregationMeta.reportingLevels;
      }
    });
  }
}
