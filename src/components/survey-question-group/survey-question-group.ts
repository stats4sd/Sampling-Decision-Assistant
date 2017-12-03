import { Component, Input, ChangeDetectorRef } from '@angular/core';
import {Events} from 'ionic-angular'
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { query } from '@angular/core/src/animation/dsl';



@Component({
  selector: 'survey-question-group',
  templateUrl: 'survey-question-group.html'
})
export class SurveyQuestionGroupComponent {
  @Input('questions') questions;
  @Input('questionNumber') questionNumber;
  @Input('showLabel') showLabel:boolean
  formGroup: FormGroup;
  groupQuestions:any;
  section:any;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private events:Events) {
    this.events.subscribe('valueUpdate', data => this.updateProgress(data.section))
    
   }

  ngAfterViewInit() {
    // slice for individual question if question number provided
    console.log('input questions',this.questions)
    this.section=this.questions[0].section;
    let questions = this.questions
    if(this.questionNumber){
      // questions = questions.splice(this.questionNumber-1,1)
      questions=[this.questions[this.questionNumber-1]]
    }
    this._generateQuestionForm(questions)
    
    
  }

  updateProgress(section){
    
    console.log('updating progress',section)
    if(section =="all" || section=="this.section"){
      console.log('section matched',section)
    }

  }

  _generateQuestionForm(questions) {
    // uses the formbuilder to a form from an array of questions provided
    let questionGroup = {}
    // generate conditions
    questions = questions.map(q => {
      if (q.condition!="") { return this._generateConditionOptions(q) }
      else { return q }
    })
    console.log('questions',questions)
    questions.forEach(q => {
      // split questions into corresponding sections
      if (!q.value) { questionGroup[q.controlName] = "" }
      questionGroup[q.controlName] = q.value

    });
    // build formgroup sections appropriately
    console.log('questionGroup',questionGroup)
    this.formGroup = this.fb.group(questionGroup)
    this.groupQuestions=questions    
    this.cdr.detectChanges()
  }

  _addSubQuestion(template){
    // create nested group
    return this.fb.group(template)
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

  shouldShowQuestion(question) {
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
