/* Takes a question and binds to appropriate input mechanism 
utilises custom form binding, find out more here:
// https://netbasal.com/angular-custom-form-controls-made-easy-4f963341c8e2
// http://anasfirdousi.com/how-to-make-custom-angular-components-form-enabled-ngModel-enabled.html
// http://blog.rangle.io/angular-2-ngmodel-and-custom-form-components/
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, forwardRef } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray, FormControl } from '@angular/forms';
import { query } from '@angular/core/src/animation/dsl';
import { Events } from 'ionic-angular';
import { AnimationBuilder, AnimationMode } from 'css-animator/builder';
import { FormProvider } from '../../../providers/form/form'
import { DataProvider } from '../../../providers/data/data';

// settings to enable a model binding
export const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SurveyQuestionComponent),
  multi: true,
};

@Component({
  selector: 'survey-question',
  templateUrl: 'survey-question.html',
  providers: [VALUE_ACCESSOR]
})
export class SurveyQuestionComponent implements ControlValueAccessor {
  @Input('question') question;
  @Input('showLabel') showLabel: boolean;
  @Input() set controlName(controlName: string) { this.question = this.formPrvdr.getQuestion(controlName) }
  @Input('repeatFormGroup') repeatFormGroup: FormGroup
  @Input('formGroup') formGroup:FormGroup;
  @Output() onValueChange = new EventEmitter<any>();
  @ViewChild('textAreaInput') textAreaInput: ElementRef
  @ViewChild('saveMessage') saveMessage: ElementRef

  value: any;
  propagateChange: any = () => { };
  showQuestion: boolean = true

  questionKey: string
  selectOtherValue: any = "";
  selectOptionsArray: string[];
  initialScrollHeight: number;
  showSelectOther: boolean = false;
  originalLabel: string;
  dynamicText: any = {};
  trackingChanges: boolean = false;
  multipleTextInput: any = ""
  multipleTextValues: any = [];
  valueSaved: boolean = false;


  constructor(
    private cdr: ChangeDetectorRef,
    private events: Events,
    public formPrvdr: FormProvider,
    public dataPrvdr: DataProvider,
  ) {
    this.events.subscribe('valueUpdate', data => this.updateLabel(data.key))
  }
  // *****************************************************
  // functions required to allow model binding 
  //******************************************************

  writeValue(value: any) {
    // method auto bound for ng-model write
    if (value) { this.value = value }
  }
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void { }

  // generic change function, sometimes uses value from bound ngmodel, sometimes from change function calls
  valueUpdated(value?, e?) {
    if (!value) { value = this.value }
    if (e) { value = e.target.value }
    // propagate value update for use in ngModel or form binding
    this.propagateChange(value);
    // notify change through emitter also for tracking in repeat group questions
    this.onValueChange.emit(value)
    //console.log('formgroup', this.formPrvdr.formGroup)
    this.dataPrvdr.backgroundSave()
    //***note - should add form value change subscribers */
    // e.g. this.formGroup.get(controlName).valueChanges.subscribe( x => console.log(x));
    // publish key-value pair in event picked up by data provider to update
    // let update = { controlName: this.question.controlName, value: value, section: this.question.section }
    // this.events.publish('valueUpdate', update)
    // this.events.publish('valueUpdated:' + update.controlName, update)
    // console.log('values',this.formPrvdr.formGroup.value)
  }

  // **********************************************************************************************
  // specific functions for question types which could be later moved to individual components
  //***********************************************************************************************

  ngOnInit() {
    // check if should show question
    this.setFormGroup()
    this.attachListeners()
    this.questionKey = this.question.controlName
    this._prepareDynamicText()
    // // run any custom onInit triggers
    if (this.question.triggers && this.question.triggers.trigger == "onInit") { this._runCustomTriggers() }
    this.cdr.detectChanges()
    // apply specific init for question types
    if (this.question.type == "select") { this.generateSelectOptions() }
    if (this.question.type == "textMultiple") {
      this._generateMultipleValues()
    }
  }

  setFormGroup(){
    // automatically load repeat/specified/default formgroup in case not passed into question
    if(this.repeatFormGroup){this.formGroup=this.repeatFormGroup}
    else{
      if(!this.formGroup){this.formGroup=this.formPrvdr.formGroup}
    }
    // check control and create new if doesn't exist
    if(!this.formGroup.controls[this.question.controlName]){
      this.formGroup.addControl(this.question.controlName,new FormControl(''))
    }
  }

  // ************** select **************************************************
  selectUpdated(value) {
    if (value == "Other (please specify)") {
      this.showSelectOther = true
    }
    else {
      this.valueUpdated(value)
    }
  }
  generateSelectOptions() {
    // parse select options to array
    if (this.question.selectOptions != "") {
      let options
      try {
        options = this.question.selectOptions.split(",")
      } catch (error) {
        options = []
      }
      // trim whitespace at start if present
      options = options.map(el => { return el.trim() })
      this.selectOptionsArray = options
      // if value not in options populate
      let value = this.formPrvdr.getSurveyValue(this.question.controlName)
      if (value != "") {
        if (this.selectOptionsArray.indexOf(value) == -1) {
          // this.showSelectOther=true
          this.selectOtherValue = value
        }
      }
    }
  }

  // ************** text multiple*********************************************

  _generateMultipleValues() {
    let value = this.formPrvdr.getSurveyValue(this.questionKey)
    console.log('value', value)
    if (value == undefined || value == "" || value == null) {
      value = []
    }
    this.multipleTextValues = value
  }
  addTextMultiple() {
    // push response to array
    let pushValue = this.multipleTextInput
    this.multipleTextValues.unshift(this.multipleTextInput)
    this.multipleTextInput = "";
    let patch = {}
    patch[this.questionKey] = this.multipleTextValues
    this.formPrvdr.formGroup.patchValue(patch)
    // notify for anything trying to monitor changes to array (e.g. repeat groups)
    this.events.publish('arrayChange:' + this.questionKey, {
      controlName: this.questionKey,
      type: 'push',
      value: this.multipleTextValues,
      pushValue: pushValue
    })
  }
  removeTextMultiple(index) {
    let removeValue = this.multipleTextValues[index]
    this.multipleTextValues.splice(index, 1)
    let patch = {}
    patch[this.questionKey] = this.multipleTextValues
    this.formPrvdr.formGroup.patchValue(patch)
    // notify for anything trying to monitor changes to array (e.g. repeat groups)
    this.events.publish('arrayChange:' + this.questionKey, { controlName: this.questionKey, type: 'splice', index: index, value: this.multipleTextValues, removeValue: removeValue })
  }


  updateSelectOther(e) {
    let value = e.target.value
    let patch = {}
    let key = this.question.controlName
    patch[key] = value
    this.formPrvdr.formGroup.patchValue(patch)
    if (value == "") {
      this.showSelectOther = false
    }
  }




  // **********************************************************************************************
  // Other functions
  //***********************************************************************************************



  updateLabel(key) {
    // updates dynamic text labels if relevant 
    if (this.dynamicText[key]) {
      console.log('updating label')
      let value = this.formPrvdr.getSurveyValue(key)
      let el = document.getElementById(this.question.type + 'LabelText')
      let className = ".dynamicText" + key
      if (el) {
        let instances = el.querySelectorAll('.dynamic-text')
        for (let i = 0; i < instances.length; i++) {
          if (instances[i].getAttribute('name') == key)
            instances[i].innerHTML = value;
        }
      }
    }
    console.log('label updated')
  }


  _runCustomTriggers() {
    // fires custom triggers saved in the question object
    if (this.question.triggers) {
      console.log('running custom trigger', this.question)
      eval(this.question.triggers.function)
      this.cdr.detectChanges()
    }
  }
  setValue(controlName, value, stringify?) {
    // called from custom triggers to set another value
    setTimeout(() => {
      // running as timeout to avoid change detection issues
      if (stringify) { value = JSON.stringify(value) }
      console.log('setting value', controlName, value)
      let patch = {}
      patch[controlName] = value
      this.formPrvdr.formGroup.patchValue(patch)
    })
  }



  _prepareDynamicText() {
    // search through text string for instances of variable references contained between {{ }}
    // NOTE, could be improved via event listeners for updates? (and possibly change event listener to announce which question changed)

    let str: string = this.question.label
    this.originalLabel = str;
    if (str.indexOf('{{') > -1) {
      // regex pattern enclosed between / ... /
      let matches = { text: [], vars: [], replacements: [] }
      matches.text = str.match(/\{\{[^}]+\}\}/mg)
      if (matches.text != null) {
        matches.vars = matches.text.map(function (x) { return x.match(/[\w\.]+/)[0]; });
      }
      matches.vars.forEach((val, i) => {
        // populate match text and current val. get current val from provider in case it is outside of current question group
        this.dynamicText[val] = {
          matchText: matches.text[i],
          currentValue: this.formPrvdr.formGroup.value[val]
        }
        // apply css
        let el = document.getElementById(this.question.type + 'LabelText')
        // use split/join to target all instances of text, apply name attribute for tracking later
        console.log('test')
        try {
          el.innerHTML = el.innerHTML.split(matches.text[i]).join("<span class='dynamic-text' name='" + val + "'>" + val + "</span>")
        } catch (error) { }
        this.updateLabel(val)
      })
    }

  }






  resize() {
    // increase height on text area automatically except when first entry row (looks jumpy otherwise as 10px increase on first char)
    let scrollHeight = this.textAreaInput.nativeElement.scrollHeight
    if (!this.initialScrollHeight) { this.initialScrollHeight = scrollHeight }
    if (scrollHeight > this.initialScrollHeight) {
      console.log('resizing')
      this.textAreaInput.nativeElement.style.height = 'auto'
      this.textAreaInput.nativeElement.style.height = this.textAreaInput.nativeElement.scrollHeight + 10 + 'px';
    }

  }
  attachListeners() {
    // 
    if (this.question.hasOwnProperty('conditionJson')) { this.showQuestion = this.checkQuestionConditions() }
  }
  checkQuestionConditions(formValues?) {
    // test logic from condition property against form, and setup listener to monitor changes
    // currently implemented for specific previous values
    let condition = this.question.conditionJson
    let control = condition.controlName
    // when running for the first time determine whether to use main form or nested repeat
    if (!formValues) {
      let formGroup: FormGroup
      if (this.formPrvdr.formGroup.controls.hasOwnProperty(control)) {
        formGroup = this.formPrvdr.formGroup
      }
      else if (this.repeatFormGroup && this.repeatFormGroup.controls.hasOwnProperty(control)) {
        formGroup = this.repeatFormGroup
      }
      else { console.error('control not found', control); return true }
      formValues = formGroup.value
      this._trackValueChanges(condition.controlName, formGroup)
    }
    // test condition
    if (condition.type == "prerequisite") {
      return formValues[condition.controlName] && formValues[condition.controlName] != ''
    }
    if (condition.type == "value") {
      return formValues[condition.controlName] == condition.value
    }
    return true

  }

  _trackValueChanges(controlName: string, formGroup: FormGroup) {
    // subscribe to value changes on form control to recheck show question condition
    //console.log('tracking value changes',control,formGroup)
    formGroup.valueChanges.subscribe(
      v => {
        this.showQuestion = this.checkQuestionConditions(v)
      }
    )
  }
}
