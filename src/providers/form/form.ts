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
  getQuestion(controlName) {
    for (let question of this.allQuestions) {
      if (question.controlName == controlName) { return question }
    }
  }
  initFormValues(values, formGroup?: FormGroup) {
    console.log('init form values',values)
    if (!formGroup) { formGroup = this.formGroup }
    // set values, building controls as required ( in simple mode, currently skipping any validators)
    Object.keys(values).forEach(key => {
      let val = values[key]
      // load string and number values
      let patch = {}
      patch[key] = val
      if (typeof (val) == "string") { formGroup.patchValue(patch) }
      if (typeof (val) == "number") { formGroup.patchValue(patch) }
      // handle arrays
      else if (val instanceof Array) {
        // handle array values stored as strings (e.g. lists)
        if (typeof val[0] == "string") {
          patch[key] = val
          formGroup.patchValue(patch)
        }
        else {
          // handle values stores as objects (e.g. repeat groups)
          // iterate over each value array (repeatGroup)
          let arrayControl: FormArray = formGroup.controls[key] as FormArray
          val.forEach((repeatGroup,i) => {
            // initialise without values and then patch to ensure correct representation of arrays
            let repeatFormGroup = this.fb.group({})
            Object.keys(repeatGroup).forEach(repeatKey=>{
              let repeatVal = repeatGroup[repeatKey]
              repeatFormGroup.addControl(repeatKey,this.fb.control(repeatVal))
            })
             arrayControl.push(repeatFormGroup)
          })
        }
      }
    })
    console.log('formgroup', this.formGroup)
    this.events.publish('form:initComplete')
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
    questions.forEach(q => {
      // build templates for any repeat groups
      if (q.type == "repeat") {
        // build formgroup sections appropriately
        let repeatQs = this._generateRepeatQuestions(q)
        q.repeatQuestions = repeatQs
        questionGroup[q.controlName] = this.fb.array([])
      }
      else {
        if (!q.value) { q.value = "" }
        // omit non questions and repeat questions (unless building repeat group)
        if (q.isQuestion == "TRUE") {
          if (!q.hasOwnProperty('repeatGroup')) { questionGroup[q.controlName] = q.value }
          else if (repeatGroup) { questionGroup[q.controlName] = q.value }
        }
      }
    });
    return this.fb.group(questionGroup)
  }

  _generateRepeatQuestions(question) {
    // get list of questions that make up repeat group. 
    //2 methods - matches all controlnames with same prefix (works but wouldn't allow nested repeat)
    // or add 'repeatGroup' meta data to question
    // **** currently using first, should change to second ***
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
      console.log('array changed', update)
      const control = <FormArray>this.formGroup.controls[groupPrefix]
      if (update.type == "push") {
        control.push(this._buildRepeatGroup(repeatQs, update.pushValue))
      }
      if (update.type == "splice") {
        // check against parent ids to remove. if no parent ids exist simply remove index given
        let removeIndex = update.index
        control.value.forEach((v, i) => {
          if (v._parentID == update.removeValue) { removeIndex = i }
        })
        control.removeAt(removeIndex)
      }
      // *** NEED METHOD FOR REORDERING FROM DRAG AND DROP ///
      // (currently not vital as array splicing done with check of _parentID)
      if (update.type == "reorder") {

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

  _buildRepeatGroup(repeatQs, parentID?) {
    // build repeat group and attach parentID if linked to another control
    let repeatGroup = this._generateQuestionForm(repeatQs, true)
    if (parentID) { repeatGroup.addControl('_parentID', this.fb.control(parentID)) }
    return repeatGroup
  }
  generateRepeatFormGroup(repeatControlName,parentID?){
    // method called from outside to generate a repeat formgroup based on control
    let repeatBase = this.getQuestion(repeatControlName)
    let repeatQs = this._generateRepeatQuestions(repeatBase)
    let repeatFormGroup = this._buildRepeatGroup(repeatQs,parentID)
    return repeatFormGroup
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
