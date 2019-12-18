import { Component, Input } from "@angular/core";
import { SurveyQuestionComponent } from "../../survey-question/survey-question";

/*
Custom component to display list of options from previous question with own input
*/

@Component({
  selector: "question-custom-strata-select",
  templateUrl: "question-custom-strata-select.html",
  styleUrls: ["question-custom-strata-select.scss"]
})
export class QuestionCustomStrataSelectComponent extends SurveyQuestionComponent {
  alreadySelected: any = {};
  selected: any = {};
  reportingLevels: any[] = [];
  @Input("preloadValue")
  preloadValue: any[];
  finalSamplingUnit: string;
  isFinalStage: boolean;
  finalChecked: any = {};

  ngOnInit() {
    // preload additional data before component rendered. hooks after input() sets so
    // all need to call after initial set value input
    this.getReportingLevels();
    this.setSavedValue(this.preloadValue);
    this.checkIfFinalStage(this.formGroup.value.name);
    this.checkAlreadySelected();
  }
  ngAfterViewInit() {
    // run after init with timeout to prevent cdr errors (not the most elegant but should work)
    setTimeout(() => {
      if (this.isFinalStage) {
        this.setFinalStageLevels();
      }
    }, 500);
  }

  getReportingLevels() {
    // get Disaggregation from stage 4, push names into array fo data binding

    // if Disaggregation null that means either stage 4 hasn't been completed or single estimate selected
    // (can distinguish case scenarios by looking at other questions or stage complete (?))
    // if Disaggregation "" that means stage 4 needs to be completed
    let levels = this.formPrvdr.getSurveyValue("reportingLevels");
    console.log("levels", levels);
    if (!levels || levels == "") {
      levels = [];
    }
    levels.forEach(level => this.reportingLevels.push(level.name));
    console.log("Disaggregation", this.reportingLevels);
  }

  checkAlreadySelected() {
    // iterates over other sampling stages disabling choices that have already been selected (not including fsu)
    let stages: any[] = this.formPrvdr.getSurveyValue("samplingStages");
    for (let stage of stages) {
      if (
        stage.name != this.formGroup.value.name &&
        stage.name != this.finalSamplingUnit
      ) {
        let selected = stage["q5.3.4.2"];
        if (selected && selected != "") {
          selected.forEach(val => {
            this.alreadySelected[val] = true;
          });
        }
      }
    }
  }

  checkIfFinalStage(stageName) {
    // if final stage note and preselect values to be all remaining levels
    let stages = this.formPrvdr.getSurveyValue("samplingStages");
    this.finalSamplingUnit = stages[stages.length - 1].name;
    if (stageName == this.finalSamplingUnit) {
      this.isFinalStage = true;
    }
  }

  setFinalStageLevels() {
    // automatically indicate any outstanding levels will be selected and attach to final sampling unit
    this.selected = {};
    this.reportingLevels.forEach(level => {
      if (!this.alreadySelected[level]) {
        this.finalChecked[level] = true;
        this.selected[level] = true;
      }
    });
    this.selectedChanged();
  }

  selectedChanged() {
    let selectedArray = [];
    for (let key of Object.keys(this.selected)) {
      if (this.selected[key]) {
        selectedArray.push(key);
      }
    }
    // send output emitter to update value
    this.onValueChange.emit(selectedArray);
  }

  saveValue(value) {
    // directly patching to form as emitters not working properly
    // note in future all questions may function this way
    let patch = {};
    patch["q5.3.4.2"] = value;
    this.formGroup.patchValue(patch);
    console.log("formGroup", this.formGroup);
  }

  setSavedValue(values: any[] = []) {
    // set saved value templates for when loading value from saved
    // sometimes initialised as empty string, ignore
    if (typeof values == "string") {
      return;
    }
    console.log("setting saved values", values);
    values.forEach(value => {
      if (this.reportingLevels.indexOf(value) > -1) {
        this.selected[value] = true;
      }
    });
    console.log("selected", this.selected);
  }
}
