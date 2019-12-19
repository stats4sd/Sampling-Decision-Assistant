// repeat group binding similar to survey-group bindings however manually update correct form controls
// as binding does not always get the correct index

import { Component, Input } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { FormProvider } from "src/app/services/form/form";

@Component({
  selector: "survey-repeat-group",
  templateUrl: "survey-repeat-group.html",
  styleUrls: ["survey-repeat-group.scss"]
})
export class SurveyRepeatGroupComponent {
  @Input("repeatIndex")
  repeatIndex: number;
  @Input("repeatFilter")
  repeatFilter: string[];
  @Input("repeatID")
  repeatID: string;
  @Input("question")
  question: any;
  @Input("showLabel")
  showLabel: any;

  repeatQuestions: any;
  displayMode: string;
  formGroup: FormGroup;
  get subFormGroup(): FormGroup {
    let repeatFormGroup = this.formGroup.controls[
      this.question.controlName
    ] as FormArray;
    return repeatFormGroup.controls[this.repeatIndex] as FormGroup;
  }

  constructor(private formPrvdr: FormProvider) {
    this.formGroup = this.formPrvdr.formGroup;
  }

  get repeatArray(): FormArray {
    // short method to return formArray control from main formGroup on get request
    let array = this.formGroup.controls[this.question.controlName] as FormArray;
    return array;
  }

  ngOnInit() {
    this.getRepeatQuestions();
    if (this.repeatIndex > -1) {
      this.displayMode = "individual";
    }
    if (!this.formGroup) {
      this.formGroup = this.formPrvdr.formGroup;
    }
  }

  getRepeatQuestions() {
    let repeatQuestions = this.formPrvdr._generateRepeatQuestions(
      this.question
    );
    if (this.repeatFilter) {
      repeatQuestions = repeatQuestions.filter(q => {
        return this.repeatFilter.indexOf(q.controlName) > -1;
      });
    }
    this.repeatQuestions = repeatQuestions;
  }

  // valueUpdated(repeatControlName, value) {
  //   console.log('value updated', value)
  //   console.log('patching index', this.repeatIndex)
  //   let patch = {}
  //   patch[repeatControlName] = value
  //   let formArray: any = this.formGroup.controls[this.question.controlName]
  //   formArray.controls[this.repeatIndex].patchValue(patch)
  //   console.log('values', this.formGroup.value)
  // }
}
