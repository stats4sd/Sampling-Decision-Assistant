import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Events } from 'ionic-angular'
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { DataProvider } from '../../providers/data/data'



@Component({
  selector: 'survey-question-group',
  templateUrl: 'survey-question-group.html'
})
export class SurveyQuestionGroupComponent {
  @Input('questions') questions;
  @Input('questionNumber') questionNumber;
  @Input('showLabel') showLabel: boolean;
  @Input('repeatQuestions') repeatQuestions: string;
  @Input('repeatGroupKey') repeatGroupKey: string;
  formGroup: FormGroup;
  groupQuestions: any;
  section: any;
  // track questions to omit from main lists
  repeatChildren: any = []

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private events: Events, private dataPrvdr: DataProvider) {
    this.events.subscribe('valueUpdate', update => { this._customUpdateTriggers(update) })
  }

  ngAfterViewInit() {
    if (this.questions) {
      console.log('questions', this.questions)
      // slice for individual question if question number provided
      this.section = this.questions[0].section;
      let questions = this.questions
      if (this.questionNumber) {
        questions = [this.questions[this.questionNumber - 1]]
      }
      // generate formgroup
      this.formGroup = this._generateQuestionForm(questions)
      console.log('formgroup', this.formGroup)
      this.cdr.detectChanges()
    }
    console.log('group questions', this.repeatQuestions)
  }

  _customUpdateTriggers(update) {
    // things that don't fall naturally into template
    if (update.controlName == "q5.1") {
      let patch = {}
      patch["q5.2"] = ''
      this.formGroup.patchValue(patch)
      console.log('value', update.value)
      if (update.value == "Yes") {
        this.events.publish('arrayChange', { controlName: "q5.2", type: 'reset', empty: false })
      }
      if (update.value == "No") {
        this.events.publish('arrayChange', { controlName: "q5.2", type: 'reset', empty: true })
      }


    }
  }


  _generateQuestionForm(questions, repeatGroup?: boolean) {
    // uses the formbuilder to a form from an array of questions provided
    let questionGroup = {}
    // generate conditions
    questions = questions.map(q => {
      if (q.condition != "") { return this._generateConditionOptions(q) }
      else { return q }
    })
    let displayQs = []
    questions.forEach(q => {
      // build templates for any repeat groups
      if (q.type == "repeat") {
        // build formgroup sections appropriately
        let repeatQs = this._generateRepeatQuestions(q)
        q.repeatQuestions = repeatQs
        questionGroup[q.controlName] = this.fb.array([])
        displayQs.push(q)
      }
      else {
        // skip questions included in repeat groups unless repeat group
        if (this.repeatChildren.indexOf(q.controlName) == -1 || repeatGroup) {
          // split questions into corresponding sections
          if (!q.value) { questionGroup[q.controlName] = "" }
          questionGroup[q.controlName] = q.value
          displayQs.push(q)
        }
      }
    });
    if (!repeatGroup) { this.groupQuestions = displayQs }
    console.log('group questions', this.groupQuestions)
    return this.fb.group(questionGroup)

  }

  _generateRepeatQuestions(question) {
    let groupPrefix = question.controlName
    let repeatQs: any = this.dataPrvdr.questionMeta.filter(q => {
      // match 3.2.1 and 3.2.2 to 3.2 group
      if (q.controlName.indexOf(groupPrefix) > -1 && q.controlName != groupPrefix) {
        this.repeatChildren.push(q.controlName)
        return true
      }
    })
    // add listener for update
    this.events.subscribe('arrayChange', update => {
      if (update.controlName == question.selectOptions) {
        const control = <FormArray>this.formGroup.controls[groupPrefix]
        if (update.type == "push") {
          // push a repeat to the question group
          control.push(this._buildRepeatGroup(repeatQs))
        }
        if (update.type == "splice") {
          control.removeAt(update.index)
        }
        if (update.type == "reset") {
          for (let i = control.length; i > 0; i--) {
            control.removeAt(i-1)
          }
          if (!update.empty) { control.push(this._buildRepeatGroup(repeatQs)) }
        }
      }
      console.log('formgroup', this.formGroup)
    })
    return repeatQs
  }

  _buildRepeatGroup(repeatQs) {
    let repeatGroup = this._generateQuestionForm(repeatQs, true)
    return repeatGroup
  }

  _addSubQuestion(template) {
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
          // match value if based on value, otherwise match exist if based on prerequisite
          // if( condition.type=="prerequisite" && this.formGroup.value[condition.controlName] && this.formGroup.value[condition.controlName] != ""){
          //   return true
          // }
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
