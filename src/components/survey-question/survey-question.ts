/* Takes a question and binds to appropriate input mechanism 
Additional features:
- auto-save on focusout or change for all elements
- automatic resize for textareas
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { query } from '@angular/core/src/animation/dsl';
import { Events } from 'ionic-angular'
import { DataProvider} from '../../providers/data/data'




@Component({
  selector: 'survey-question',
  templateUrl: 'survey-question.html'
})
export class SurveyQuestionComponent {
  @Input('question') question;
  @Input('formGroup') formGroup: FormGroup
  @ViewChild('textAreaInput') textAreaInput: ElementRef
  questionKey:string  
  selectOtherValue: any = "";
  selectOptionsArray: string[];
  initialScrollHeight: number;
  showSelectOther: boolean = false;
  originalLabel: string;
  dynamicText: any = {};
  multipleTextInput:any=""
  multipleTextValues:any=[]

  constructor(private cdr: ChangeDetectorRef, private events: Events, private dataPrvdr:DataProvider) {
    this.events.subscribe('valueUpdate', data => this.updateLabel(data.key))

  }
  ngAfterViewInit() {
    this.questionKey=this.question.controlName
    this._generateSelectOptions()
    this._generateMultipleValues()
    this._prepareDynamicText()
    this.cdr.detectChanges()



  }
  updateLabel(key) {
    // updates dynamic text labels if relevant 
    if (this.dynamicText[key]) {  
      let value = this.dataPrvdr.getSurveyValue(key)    
      let el = document.getElementById(this.question.type+'LabelText')
      let className=".dynamicText"+key
      let instances = el.querySelectorAll('.dynamic-text')
      for (let i = 0; i < instances.length; i++) {
        if(instances[i].getAttribute('name')==key)
        instances[i].innerHTML = value;
    }
    }
  }

  saveValue() {
    // save value on update (do not exclude "" in case user might have deleted a value)
    let key = this.question.controlName
    let value = this.formGroup.value[key]
    let update = { key: key, value: value, section: this.question.section }
    // publish key-value pair in event picked up by data provider to update
    this.events.publish('valueUpdate', update)

  }
  _generateSelectOptions() {
    // parse select options to array
    if (this.question.selectOptions != "") {
      let options = this.question.selectOptions.split(",")
      // trim whitespace at start if present
      options = options.map(el => { return el.trim() })
      this.selectOptionsArray = options
      // if value not in options populate
      let value = this.formGroup.value[this.question.controlName]
      if (value != "") {
        if (this.selectOptionsArray.indexOf(value) == -1) {
          // this.showSelectOther=true
          this.selectOtherValue = value
        }
      }
    }
  }
  _generateMultipleValues(){
    if(this.question.type=="textMultiple"){
      let value = this.dataPrvdr.getSurveyValue(this.questionKey)
      console.log('multiple val in',value)
      if(value==undefined || value=="" || !value==null){
        value=[]
      }
      else{value = JSON.parse(value)}
      this.multipleTextValues=value
    }
  }
  _prepareDynamicText() {
    // search through text string for instances of variable references contained between {{ }}

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
          currentValue: this.dataPrvdr.getSurveyValue(val)
        }
        // apply css
      let el = document.getElementById(this.question.type+'LabelText')
      // use split/join to target all instances of text, apply name attribute for tracking later
      // el.innerHTML=el.innerHTML.split(matches.text[i]).join("<span class='dynamic-text dynamicText"+val+"'>"+matches.text[i]+"</span>")
      el.innerHTML=el.innerHTML.split(matches.text[i]).join("<span class='dynamic-text' name='"+val+"'>"+val+"</span>")
      this.updateLabel(val)
      })
      
     
    }

  }
  selectUpdated() {
    let value = this.formGroup.value[this.question.controlName]
    if (value == "Other (please specify)") {
      this.showSelectOther = true
    }
    else {
      this.saveValue()
    }
  }

  updateSelectOther(e) {
    let value = e.target.value
    let patch = {}
    let key = this.question.controlName
    patch[key] = value
    this.formGroup.patchValue(patch)
    this.saveValue()
    if (value == "") {
      this.showSelectOther = false
    }
  }

  addTextMultiple(){
    // push response to array
    this.multipleTextValues.push(this.multipleTextInput)
    this.multipleTextInput=""
    this.formGroup.value[this.questionKey]=JSON.stringify(this.multipleTextValues)
    this.saveValue()
  }
  removeTextMultiple(index){
    this.multipleTextValues.splice(index,1)
    this.formGroup.value[this.questionKey]=JSON.stringify(this.multipleTextValues)
    this.saveValue()
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









}
