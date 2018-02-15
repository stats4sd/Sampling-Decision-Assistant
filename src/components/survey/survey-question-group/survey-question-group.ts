// display multiple questions on same card

import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormProvider } from '../../../providers/form/form'

@Component({
  selector: 'survey-question-group',
  templateUrl: 'survey-question-group.html'
})

export class SurveyQuestionGroupComponent {
  @Input('showLabel') showLabel: boolean;

  @Input() set filter(filter: any) {
    // when question number or section set automatically filter the questions
    this.filterQuestionsList = filter
    this._filterQuestions()
  };
  // array of questions to show in repeat group
  @Input() set repeatFilter(repeatFilter: string[]){
    this._repeatFilterList = repeatFilter
    console.log('repeat filter list',this._repeatFilterList)
  }
  @Input() set section(section: string) {
    // survey subsection questions
    this._section = section
    this._filterQuestions()
  }
  // @Input() set repeatGroup(repeatGroup: string) {
  //   // filter questions matching repeat group
  //   this._repeatGroup = repeatGroup
  //   this._filterQuestions()
  // }

  @Input() set repeatIndex(repeatIndex: number) {
    // used to only show one set in repeat group
    this.showAllRepeats = false
    this._repeatIndex = repeatIndex
  }

  filterQuestionsList: string[];
  _repeatFilterList:string[]=[];
  _section: string;
  _omit: string[] = [];
  _repeatIndex: number;
  _repeatGroup: string;
  showAllRepeats: boolean = true
  formGroup: FormGroup;
  allQuestions: any;
  groupQuestions: any;

  // track questions to omit from main lists
  repeatChildren: any = []

  constructor(private formPrvdr: FormProvider) {
    // bind to master formgroup and questions
    this.formGroup = this.formPrvdr.getFormGroup()
    this.allQuestions = this.formPrvdr.allQuestions
    console.log('formgroup', this.formGroup)
    this.groupQuestions = this.allQuestions
  }

  _filterQuestions() {
    // filter questions by section and optionally also down to individual question number
    let filtered = this.allQuestions
    // filter to match a given section
    if (this._section) {
      let section = this._section
      filtered = filtered.filter(q => {
        return q.section == section
      })
    }
    // filter down to individual questions
    if (this.filterQuestionsList) {
      filtered = filtered.filter(q => {
        return this.filterQuestionsList.indexOf(q.controlName) > -1
      })
    }
    this.groupQuestions = filtered
    console.log('group questions', this.groupQuestions)
  }

  getRepeatGroupTitle(question, index) {
    try {
      let indices = JSON.parse(this.formGroup.value[question.selectOptions])
      if (indices.length < 2) { return "" }
      else { return indices[index] }
    } catch (error) {
      return ""
    }

  }
}
