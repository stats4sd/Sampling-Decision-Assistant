import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { ProjectActions } from "../../actions/actions";
import { Events } from "@ionic/angular";
import { ALL_QUESTIONS } from "src/app/data";

@Injectable({
  providedIn: "root"
})
export class FormProvider {
  public formGroup: FormGroup;
  public allQuestions = ALL_QUESTIONS;
  groupQuestions: any;
  section: any;
  // track questions to omit from main lists
  repeatChildren: any = [];
  public historicValues: any = {};

  constructor(
    public fb: FormBuilder,
    private events: Events,
    private projectActions: ProjectActions
  ) {
    this.events.subscribe("valueUpdate", update => {
      this._customUpdateTriggers(update);
    });
    this._init();
  }

  _init() {
    this.formGroup = this.fb.group({});
    // reflect form value changes to redux
    this.formGroup.valueChanges.pipe(debounceTime(200)).subscribe(v => {
      if (v) {
        this.projectActions.updateProjectValues(v);
        Object.keys(v).forEach(k => {
          let val = v[k];
          if (val && val != "N/A") {
            this.historicValues[k] = val;
          }
        });
      }
    });
  }

  getSurveyValue(key) {
    return this.formGroup.value[key];
  }
  getQuestion(controlName) {
    for (let question of this.allQuestions) {
      if (question.controlName == controlName) {
        return question;
      }
    }
  }
  initFormValues(values, formGroup?: FormGroup) {
    //if (!formGroup) { formGroup = this.formGroup }
    // set values, building controls as required ( in simple mode, currently skipping any validators)
    let patch = {};
    Object.keys(values).forEach(key => {
      let val = values[key];
      // load string and number values
      if (val != "") {
        // add controls on the fly if they don't exist
        if (!this.formGroup.controls["key"]) {
          this.formGroup.addControl(key, this.fb.control(val));
        }
        patch[key] = val;
      }
    });
    // patch all values
    this.formGroup.patchValue(patch);
    // publish event for listener in tree diagram component
    this.events.publish("form:initComplete");
    return formGroup;
  }

  _customUpdateTriggers(update) {
    // things that don't fall naturally into template
    if (update.controlName == "q5.1") {
      // patch to alter repeat group repeats
      let patch = {};
      patch["q5.2"] = "";
      this.formGroup.patchValue(patch);
      if (update.value == "Yes") {
        this.events.publish("arrayChange:q5.3", {
          controlName: "q5.3",
          type: "reset",
          empty: false
        });
      }
      if (update.value == "No") {
        this.events.publish("arrayChange:q5.3", {
          controlName: "q5.3",
          type: "reset",
          empty: true
        });
      }
    }
  }

  _generateQuestionForm(questions, repeatGroup?: boolean) {
    // uses the formbuilder to a form from an array of questions provided
    let questionGroup = {};
    // filter out invalid questions (keep non-questions as may be labels or feedback)
    questions = questions.filter(q => {
      if (!q.controlName || q.controlName == "") {
        return false;
      }
      return true;
    });
    // generate conditions
    questions = questions.map(q => {
      if (q.condition != "") {
        q.conditionJson = this._generateConditionOptions(q.condition);
      }
      return q;
    });
    console.log("questions", questions);
    questions.forEach(q => {
      questionGroup[q.controlName] = q.value;
    });
    return this.fb.group(questionGroup);
  }

  _generateRepeatQuestions(question) {
    // get list of questions that make up repeat group.
    //2 methods - matches all controlnames with same prefix (works but wouldn't allow nested repeat)
    // or add 'repeatGroup' meta data to question
    // **** currently using first, should change to second ***
    let groupPrefix = question.controlName;
    let repeatQs: any = this.allQuestions.filter(q => {
      // match 3.2.1 and 3.2.2 to 3.2 group
      if (
        q.controlName.indexOf(groupPrefix) > -1 &&
        q.controlName != groupPrefix
      ) {
        //this.repeatChildren.push(q.controlName)
        return true;
      }
    });
    // add listener for update, e.g. if values depend on 4.2 listn for arrayChange:4.2
    this.events.unsubscribe("arrayChange:" + question.selectOptions);
    this.events.subscribe("arrayChange:" + question.selectOptions, update => {
      const control = this.formGroup.controls[groupPrefix] as FormArray;
      if (update.type == "push") {
        control.push(this._buildRepeatGroup(repeatQs, update.pushValue));
      }
      if (update.type == "splice") {
        // check against parent ids to remove. if no parent ids exist simply remove index given
        let removeIndex = update.index;
        control.value.forEach((v, i) => {
          if (v._parentID == update.removeValue) {
            removeIndex = i;
          }
        });
        control.removeAt(removeIndex);
      }
      // *** NEED METHOD FOR REORDERING FROM DRAG AND DROP ///
      // (currently not vital as array splicing done with check of _parentID)
      if (update.type == "reorder") {
      }
      if (update.type == "reset") {
        for (let i = control.length; i > 0; i--) {
          control.removeAt(i - 1);
        }
        if (!update.empty) {
          control.push(this._buildRepeatGroup(repeatQs));
        }
      }
    });
    return repeatQs;
  }

  _buildRepeatGroup(repeatQs, parentID?) {
    // build repeat group and attach parentID if linked to another control
    let repeatGroup = this._generateQuestionForm(repeatQs, true);
    if (parentID) {
      repeatGroup.addControl("_parentID", this.fb.control(parentID));
    }
    return repeatGroup;
  }
  generateRepeatFormGroup(repeatControlName, parentID?) {
    // method called from outside to generate a repeat formgroup based on control
    let repeatBase = this.getQuestion(repeatControlName);
    let repeatQs = this._generateRepeatQuestions(repeatBase);
    let repeatFormGroup = this._buildRepeatGroup(repeatQs, parentID);
    return repeatFormGroup;
  }

  _addSubQuestion(template) {
    // create nested group
    return this.fb.group(template);
  }

  _generateConditionOptions(condition: string) {
    // take text condition string and turn into json element for use in show logic function
    let json: any = {};
    let propertiesArray = condition.split(",");
    propertiesArray.forEach(el => {
      let a = el.split(":");
      let key = a[0].trim();
      let val = a[1].trim();
      json[key] = val;
    });
    return json;
  }
}
