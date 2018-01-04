import { Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormProvider } from '../../providers/form/form'

@Component({
  selector: 'survey-question-group',
  templateUrl: 'survey-question-group.html'
})

export class SurveyQuestionGroupComponent {
  @Input('showLabel') showLabel: boolean;
  // when question number or section set automatically filter the questions
  @Input() set questionNumber(questionNumber: number) {
    this._questionNumber = questionNumber
    this._filterQuestions()
  };
  @Input() set section(section: string) {
    this._section = section
    this._filterQuestions()
  }
  _questionNumber: number;
  _section: string;
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
      if (this._questionNumber) {
        filtered = [filtered[this._questionNumber - 1]]
      }
      this.groupQuestions = filtered
      console.log('group questions', this.groupQuestions)
    }
  }

  getRepeatGroupTitle(question,index){
    try {
      let indices = JSON.parse(this.formGroup.value[question.selectOptions])
      if(indices.length<2){return ""}
      else {return indices[index]}
    } catch (error) {
      return ""
    }
    
  }


  shouldShowQuestion(question) {
    // test logic from condition property against form
    // currently implemented for specific previous values

    if (question.hasOwnProperty('conditionJson')) {
      let condition = question.conditionJson
      if (this.formGroup && this.formGroup.value) {
        if (this.formGroup.value.hasOwnProperty(condition.controlName)) {
          if (condition.type == "prerequisite") {
            if (this.formGroup.value[condition.controlName] && this.formGroup.value[condition.controlName] != '') {
              return true
            }
          }
          if (condition.type == "value") {
            if (this.formGroup.value[condition.controlName] == condition.value) {
              return true
            }
          }
          else { return false }
        }
      }
      return false
    }
    return true
  }

}
