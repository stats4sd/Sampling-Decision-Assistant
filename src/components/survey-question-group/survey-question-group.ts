import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { query } from '@angular/core/src/animation/dsl';


@Component({
  selector: 'survey-question-group',
  templateUrl: 'survey-question-group.html'
})
export class SurveyQuestionGroupComponent {
  @Input('questions') questions;
  formGroup: FormGroup;
  public payLoad: any;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this._generateQuestionForm()
  }

  _generateQuestionForm() {
    // uses the formbuilder to a form from an array of questions provided
    let questionGroup = {}
    // generate conditions
    let questions = this.questions.map(q => {
      if (q.condition!="") { return this._generateConditionOptions(q) }
      else { return q }
    })
    console.log('questions condition complete', questions)

    questions.forEach(q => {
      // split questions into corresponding sections
      if (!q.value) { questionGroup[q.controlName] = "" }
      else { questionGroup[q.controlName = q.value] }

    });
    // build formgroup sections appropriately
    this.formGroup = this.fb.group(questionGroup)
    console.log('formGroup', this.formGroup)
    this.cdr.detectChanges()
  }

  save() {
    this.payLoad = JSON.stringify(this.formGroup.value);
    console.log('payload', this.payLoad)
  }

  _generateConditionOptions(question) {
    // take text condition string and turn into json element for use in show logic function
    let json = {}
    let propertiesString = question.condition
    let propertiesArray = propertiesString.split(',')
    propertiesArray.forEach(el => {
      let a = el.split(':');
      let key = a[0].trim();
      let val = a[1].trim();
      json[key] = val
    });
    question.conditionJson = json
    return question
  }

  showQuestion(question) {
    // test logic from condition property against form
    // currently implemented for specific previous values
    if (question.hasOwnProperty('conditionJson')) {
      let condition = question.conditionJson
      if (this.formGroup && this.formGroup.value) {
        if (this.formGroup.value.hasOwnProperty(condition.controlName)) {
          if (this.formGroup.value[condition.controlName] == condition.value) {
            return true
          }
          else { return false }
        }
      }
      return false
    }
    return true
  }

}
