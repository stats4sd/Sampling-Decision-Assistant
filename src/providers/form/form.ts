import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular'
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import 'rxjs/add/operator/map';
import questionMeta from '../questionMeta';

@Injectable()
export class FormProvider {
  public formGroup: FormGroup;
  public allQuestions = questionMeta
  groupQuestions: any;
  section: any;
  // track questions to omit from main lists
  repeatChildren: any = []

  constructor(private fb: FormBuilder, private events: Events) {
    this.events.subscribe('valueUpdate', update => {
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

  getSurveyValue(key) {
    return this.formGroup.value[key]
  }
  initFormValues(values,formGroup?:FormGroup) {
    if(!formGroup){formGroup=this.formGroup}
    // set values, building controls as required ( in simple mode, currently skipping any validators)
    Object.keys(values).forEach(key => {
      let val = values[key]
      // load string values
      let patch = {}
      patch[key] = val
      if (typeof (val) == "string") {formGroup.patchValue(patch)}
      if (typeof (val) == "number") {formGroup.patchValue(patch)}
      // handle arrays
      else if (val instanceof Array) {
        // handle array values stored as strings (e.g. lists)
        if (typeof val[0] == "string") {formGroup.patchValue(patch)}
        else {
          // handle values stores as objects (e.g. repeat groups)
          // create controls for repeat group questions
          let question = this.allQuestions.filter(q => { return q.controlName == key })[0]
          let repeatQs = this._generateRepeatQuestions(question)
          // build repeat formgroup
          let repeatGroup = this._generateQuestionForm(repeatQs)
          let repeatGroupArray=[]
          // update value on repeatQs
          for (let repeatValues of val) {
            let group = this.initFormValues(repeatValues,repeatGroup)
            repeatGroupArray.push(group)
          }
          formGroup.setControl(key, this.fb.array(repeatGroupArray))
        }
      }
    })
    console.log('formgroup set',formGroup)
    return formGroup
  }

  _customUpdateTriggers(update) {
    // things that don't fall naturally into template
    if (update.controlName == "q5.1") {
      // patch to alter repeat group repeats
      let patch = {}
      patch["q5.2"] = ''
      this.formGroup.patchValue(patch)
      if (update.value == "Yes") {
        this.events.publish('arrayChange:q5.3', { controlName: "q5.3", type: 'reset', empty: false })
      }
      if (update.value == "No") {
        this.events.publish('arrayChange:q5.3', { controlName: "q5.3", type: 'reset', empty: true })
      }
    }
  }


  _generateQuestionForm(questions, repeatGroup?: boolean) {
    // uses the formbuilder to a form from an array of questions provided
    let questionGroup = {}
    // filter out invalid questions (keep non-questions as may be labels or feedback)
    questions = questions.filter(q => {
      if (!q.controlName || q.controlName == "") { return false }
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
        if (!q.value) { q.value = "" }
        questionGroup[q.controlName] = q.value
        // skip questions included in repeat groups unless repeat group
        // if (this.repeatChildren.indexOf(q.controlName) == -1 || repeatGroup) {
        //   if (!q.value) { q.value = "" }
        //   displayQs.push(q)
        //   // omit non question from form (but keep in display)
        //   if (q.isQuestion == "TRUE") {
        //     questionGroup[q.controlName] = q.value
        //   }
        // }
      }
    });
    //if (!repeatGroup) { this.groupQuestions = displayQs }
    // remove label and other parts not interested in final formgroup
    return this.fb.group(questionGroup)

  }

  _generateRepeatQuestions(question) {
    // takes a question prefix and groups all sub questions into a repeat group
    let groupPrefix = question.controlName
    let repeatQs: any = this.allQuestions.filter(q => {
      // match 3.2.1 and 3.2.2 to 3.2 group
      if (q.controlName.indexOf(groupPrefix) > -1 && q.controlName != groupPrefix) {
        //this.repeatChildren.push(q.controlName)
        return true
      }
    })
    // add listener for update, e.g. if values depend on 4.2 listn for arrayChange:4.2
    this.events.unsubscribe('arrayChange:' + question.selectOptions)
    this.events.subscribe('arrayChange:' + question.selectOptions, update => {
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
