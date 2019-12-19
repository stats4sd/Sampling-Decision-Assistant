// display multiple questions on same card

import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormProvider } from "src/app/services/form/form";

@Component({
  selector: "survey-question-group",
  templateUrl: "survey-question-group.html",
  styleUrls: ["survey-question-group.scss"]
})
export class SurveyQuestionGroupComponent {
  @Input("showLabel") showLabel: boolean;
  @Input() set filter(filter: any) {
    // when question number or section set automatically filter the questions
    this.filterQuestionsList = filter;
  }
  @Input("section") section: string;
  @Input("questions") questions: any[];
  @Input("formGroup") formGroup: FormGroup;

  // variables passed onto survey-repeat-group in case of repeat group question
  @Input("repeatFilter") repeatFilter: string[];
  @Input("repeatIndex") repeatIndex: number;
  @Input("repeatID") repeatID: string;
  @Input("formArrayName") formArrayName: any;
  @Input("formGroupName") formGroupName: any;

  filterQuestionsList: string[];
  //formGroup: FormGroup;
  allQuestions: any;
  groupQuestions: any;

  // track questions to omit from main lists
  repeatChildren: any = [];

  constructor(private formPrvdr: FormProvider) {
    // bind to master formgroup and questions
    this.formGroup = this.formPrvdr.formGroup;
    console.log("formgroup", this.formGroup);
  }
  ngOnInit() {
    // initialise questions from list provided (or load all) and filter
    if (this.questions) {
      this.allQuestions = this.questions;
    } else {
      this.allQuestions = this.formPrvdr.allQuestions;
    }
    this.groupQuestions = this.allQuestions;
    this._filterQuestions();
    // set formgroup
    if (!this.formGroup) {
      this.formGroup = this.formPrvdr.formGroup;
    }
  }

  _filterQuestions() {
    // filter questions by section and optionally also down to individual question number
    let filtered = this.allQuestions;
    // filter to match a given section
    if (this.section) {
      let section = this.section;
      filtered = filtered.filter(q => {
        return q.section == section;
      });
    }
    // filter down to individual questions
    if (this.filterQuestionsList) {
      filtered = filtered.filter(q => {
        return this.filterQuestionsList.indexOf(q.controlName) > -1;
      });
    }
    this.groupQuestions = filtered;
  }

  // getRepeatGroupTitle(question, index) {
  //   try {
  //     let indices = JSON.parse(this.formGroup.value[question.selectOptions])
  //     if (indices.length < 2) { return "" }
  //     else { return indices[index] }
  //   } catch (error) {
  //     return ""
  //   }

  // }
}
