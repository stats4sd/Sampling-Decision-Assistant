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
  selectOtherValue: any = "";
  selectOptionsArray: string[];
  initialScrollHeight: number;
  showSelectOther: boolean = false;
  originalLabel: string;
  dynamicText: any = {}

  constructor(private cdr: ChangeDetectorRef, private events: Events, private dataPrvdr:DataProvider) {
    this.events.subscribe('valueUpdate', data => this.updateLabel(data.key, data.value))

  }
  ngAfterViewInit() {
    this._generateSelectOptions()
    this._prepareDynamicText()
    this.cdr.detectChanges()



  }
  updateLabel(key?, value?) {
    // updates dynamic text labels if relevant 
    if (Object.keys(this.dynamicText).length > 0) {
      if (key && this.dynamicText.hasOwnProperty(key)) {
        // if sent key appears in text update the mapping value to be processed next cycle (and send to next cycle)
        this.dynamicText[key].currentValue = value
        this.updateLabel()
      }
      else {
        let label = this.originalLabel
         // iterate through all keys in case multiple exist in a question, populating with previously stored answered
        for (let k in this.dynamicText) {
          let matchText = this.dynamicText[k].matchText
          let replaceText = this.dynamicText[k].currentValue
          label = label.replace(matchText,replaceText)
        }
        this.question.label = label
      }
    }
  }

  saveValue() {
    // save value on update (do not exclude "" in case user might have deleted a value)
    let key = this.question.controlName
    let value = this.formGroup.value[key]
    let update = { key: key, value: value }
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

      })
      // run initial replace for saved values
      this.updateLabel()
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

    // this.formGroup.value[this.question.controlName] = value


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
