import { Component, Input } from "@angular/core";
import { StagePage } from "../../stage.page";

import { select } from "@angular-redux/store";
import { Observable, Subscription, Subject } from "rxjs";
import { flyin } from "src/app/services/animationStates";
import { ProjectValues } from "src/app/models/models";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "stage-complete",
  templateUrl: "stage-complete.html",
  styleUrls: ["stage-complete.scss"],
  animations: [flyin]
})
export class StageCompleteComponent extends StagePage {
  removeSubscriptions$ = new Subject();
  @select(["activeProject", "stagesComplete"])
  readonly stagesComplete$: Observable<boolean[]>;
  @select(["activeProject", "title"])
  readonly projectTitle$: Observable<string>;
  @Input("disabled")
  disabled: boolean;
  @Input("stageNumber")
  stageNumber: number;
  @Input("text")
  text: string;
  @Input("hideButton")
  hideButton: boolean;

  lastCall: number = 0;
  sectionValid: boolean = false;
  stagesComplete: boolean[] = [];
  projectTitle: string;
  projectTitleInput: string;
  showErrorMsg: boolean;
  isSaving: boolean;

  ngOnInit() {
    // subscribe to form value changes to mark when section complete
    this.checkSectionValid();
    this.ngRedux
      .select(["activeProject", "values"])
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(v => {
        if (v) {
          this.checkSectionValid();
        }
      });
    this.stagesComplete$.subscribe(s => {
      if (s) {
        this.stagesComplete = s;
      }
    });
    this.projectTitle$.subscribe(t => (this.projectTitle = t));
  }
  ngOnDestroy() {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }

  saveProjectTitle() {
    // check title unique, if unique save and update state, if not show error message
    if (this.dataPrvdr.checkProjectTitleUnique(this.projectTitleInput) == -1) {
      this.showErrorMsg = false;
      this.isSaving = true;
      this.dataPrvdr.activeProject.title = this.projectTitleInput;
      this.dataPrvdr.backgroundSave().then(res => {
        // running project update after as for some reason it rewrites url (#129)
        setTimeout(() => {
          this.projectActions.setActiveProject(this.dataPrvdr.activeProject);
          this.isSaving = false;
        }, 500);
      });
    } else {
      this.showErrorMsg = true;
    }
  }

  checkSectionValid() {
    // initial function to throttle verification call to only run max once per 200ms to avoid multiple change detection calls
    const now = new Date().getTime();
    if (now - this.lastCall > 300) {
      this.lastCall = now;
      setTimeout(() => {
        let v = {};
        try {
          v = this.ngRedux.getState().activeProject.values;
        } catch (error) {}
        this.sectionValid = this.verify(this.stage.number, v);
      }, 200);
    }
  }

  verify(stageNumber: number, formValues: ProjectValues) {
    const s = stageNumber;
    // run verfication checks to see if form valid. takes current form values as input
    const v = formValues;
    switch (true) {
      case s == 1: {
        if (v["q1.3"]) {
          return true;
        }
        if (v["q1.2"] == "Non-representative") {
          return true;
        }
        if (
          v["q1.1"] ==
          "A comparison that needs a quasi-experimental or an experimental approach"
        ) {
          return true;
        } else {
          // *** add back in ?***
          // this.dataPrvdr.activeProject.stagesComplete[1] = false
          this.stagesComplete[1] = false;
          // this.projectActions.updateProjectCompletion(this.stagesComplete)
          return false;
        }
      }
      case s == 2: {
        if (v["q2.3.1"]) {
          return true;
        } else if (v["q2.2.2"]) {
          return true;
        } else if (v["q2.2.3"] && v["q2.2.4"]) {
          return true;
        } else {
          return false;
        }
      }
      case s == 3: {
        return true;
      }
      case s == 4: {
        if (v["reportingLevels"]) {
          return true;
        }
        if (v["q4.3"]) {
          return true;
        }
      }
      case s == 5: {
        //console.log('evaluating section valid 5')
        if (v.samplingStages) {
          const built = v.samplingStages.filter(stage => {
            return stage._built;
          });
          return built.length == v.samplingStages.length ? true : false;
        } else {
          return false;
        }
      }
      case s == 6: {
        // *** basic validation of some allocation complete, could be improved on
        if (
          v._allocation &&
          v._allocation.aggregationSampleSize >=
            v._allocation.recommendedAggregationSize
        ) {
          return true;
        }
        break;
      }
      default: {
        console.log("default case", s);
        return true;
      }
    }
  }

  nextStage() {
    let next: number = this.stage.number + 1;
    this.router.navigate(["../../" + next], {
      relativeTo: this.route,
      replaceUrl: true
    });
  }
  goToReview() {
    this.router.navigate(["../../../review"], {
      relativeTo: this.route,
      replaceUrl: true
    });
  }

  toggleCheckbox() {
    this.projectActions.updateStagesComplete(this.stagesComplete);
    this.dataPrvdr.backgroundSave();
  }
}
