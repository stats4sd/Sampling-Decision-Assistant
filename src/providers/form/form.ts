import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular'
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import 'rxjs/add/operator/map';
import questionMeta from '../questionMeta';

@Injectable()
export class FormProvider {
  public formGroup: FormGroup;
  allQuestions = questionMeta
  groupQuestions: any;
  section: any;
  // track questions to omit from main lists
  repeatChildren: any = []

  constructor(private fb: FormBuilder, private events: Events) {
    this.events.subscribe('valueUpdate', update => {
      console.log('update received', this.formGroup)
      this._customUpdateTriggers(update)
    })
    this._init()
  }

  _init() {
    let questions = questionMeta
    console.log('all questions', questions)
    this.formGroup = this._generateQuestionForm(questions)
    console.log('master formgroup', this.formGroup)
  }

  getSurveyValue(key){
    return this.formGroup.value[key]
  }
  initFormValues(values) {
    // set values, building controls as required ( in simple mode, currently skipping any validators)
    Object.keys(values).forEach(key => {
      let val = values[key]
      // load string values
      if (typeof (val) == "string") {
        let patch = {}
        patch[key] = val
        this.formGroup.patchValue(patch)
      }
      // create controls for repeat group questions
      else if (val instanceof Array) {
        let question = this.allQuestions.filter(q => { return q.controlName == key })[0]
        let repeatQs = this._generateRepeatQuestions(question)
        // update value on repeatQs
        for (let repeat of val) {
          repeatQs.map(q => {
            q.value = repeat[q.controlName]
          })
          const control = <FormArray>this.formGroup.controls[key]
          control.push(this._buildRepeatGroup(repeatQs))
        }
      }
    })
    console.log('formgroup', this.formGroup)
  }

  getFormGroup() {
    if (this.formGroup) { return this.formGroup }
    else {
      this.formGroup = this._generateQuestionForm(questionMeta)
      return this.formGroup
    }
  }
  getQuestions() {
    // return questions pre-processed to remove repeat groups and other unwanted features
    if (this.groupQuestions) { return this.groupQuestions }
    else {
      this._generateQuestionForm(questionMeta)
      return this.groupQuestions
    }
  }



  _customUpdateTriggers(update) {
    // things that don't fall naturally into template
    if (update.controlName == "q5.1") {
      // patch to alter repeat group repeats
      let patch = {}
      patch["q5.2"] = ''
      this.formGroup.patchValue(patch)
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
    // filter out invalid questions (keep non-questions as may be labels or feedback)
    questions = questions.filter(q => {
      if (!q.controlName || q.controlName == "") { return false }
      // if(q.isQuestion!="TRUE"){return false}
      return true
    })
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
          if (!q.value) { q.value = "" }
          displayQs.push(q)
          // omit non question from form (but keep in display)
          if (q.isQuestion == "TRUE") {
            questionGroup[q.controlName] = q.value
          }
        }
      }
    });
    if (!repeatGroup) { this.groupQuestions = displayQs }
    // remove label and other parts not interested in final formgroup
    return this.fb.group(questionGroup)

  }

  _generateRepeatQuestions(question) {
    // takes a question prefix and groups all sub questions into a repeat group
    let groupPrefix = question.controlName
    let repeatQs: any = this.allQuestions.filter(q => {
      // match 3.2.1 and 3.2.2 to 3.2 group
      if (q.controlName.indexOf(groupPrefix) > -1 && q.controlName != groupPrefix) {
        this.repeatChildren.push(q.controlName)
        return true
      }
    })
    // add listener for update
    this.events.unsubscribe('arrayChange')
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
            control.removeAt(i - 1)
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
}
