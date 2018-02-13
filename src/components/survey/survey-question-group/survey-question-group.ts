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

  @Input() set filter(filterQuestions: any) {
    // when question number or section set automatically filter the questions
    this.filterQuestions = filterQuestions
    this._filterQuestions()
  };
  @Input() set section(section: string) {
    // survey subsection questions
    this._section = section
    this._filterQuestions()
  }
  @Input() set omit(omit: any) {
    // intended to omit specific question from group, although currently handled with question condition logic instead
    this._omit = omit
  }
  @Input() set repeatIndex(repeatIndex: number){
    console.log('repeat index',repeatIndex)
    this.showAllRepeats=false
    this._repeatIndex=repeatIndex
  }
  // used to only show one set in repeat group
  filterQuestions: string[];
  _section: string;
  _omit: string[] = [];
  _repeatIndex:number;
  showAllRepeats:boolean=true
  formGroup: FormGroup;
  allQuestions: any;
  groupQuestions: any;

  // track questions to omit from main lists
  repeatChildren: any = []

  constructor(private formPrvdr: FormProvider) {
    // bind to master formgroup and questions
    this.formGroup = this.formPrvdr.getFormGroup()
    this.allQuestions = this.formPrvdr.getQuestions()
    this.groupQuestions = this.allQuestions
  }

  _filterQuestions() {
    // filter questions by section and optionally also down to individual question number
    let filtered = []
    if (this._section) {
      let section = this._section
      let questions: any[] = this.allQuestions
      filtered = questions.filter(q => {
        return q.section == section
      })
      if (this.filterQuestions) {
        filtered = filtered.filter(q => {
          return this.filterQuestions.indexOf(q.controlName) > -1
        })
      }
      this.groupQuestions = filtered
      console.log('group questions', this.groupQuestions)
    }
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
