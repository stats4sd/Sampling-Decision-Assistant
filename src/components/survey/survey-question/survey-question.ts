/* Takes a question and binds to appropriate input mechanism 
Additional features:
- auto-save on focusout or change for all elements
- automatic resize for textareas
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { query } from '@angular/core/src/animation/dsl';
import { Events } from 'ionic-angular';
import { AnimationBuilder, AnimationMode } from 'css-animator/builder';
import { FormProvider } from '../../../providers/form/form'
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'survey-question',
  templateUrl: 'survey-question.html'
})
export class SurveyQuestionComponent {
  @Input('question') question;
  @Input('formGroup') formGroup: FormGroup;
  @Input('showLabel') showLabel: boolean;;
  @ViewChild('textAreaInput') textAreaInput: ElementRef
  @ViewChild('saveMessage') saveMessage: ElementRef
  questionKey: string
  selectOtherValue: any = "";
  selectOptionsArray: string[];
  initialScrollHeight: number;
  showSelectOther: boolean = false;
  originalLabel: string;
  dynamicText: any = {};
  multipleTextInput: any = ""
  multipleTextValues: any = [];
  valueSaved: boolean = false;
  dragulaOptions = {
    moves: function (el, source, handle, sibling) {
      // allow move on possible drag-handles (required as drag on button sometimes selects inner html first, then button, then parent div)
      return el.dataset.dragHandle || handle.parentElement.parentElement.dataset.dragHandle;
    },
  }

  constructor(private cdr: ChangeDetectorRef, private events: Events, private formPrvdr: FormProvider, private dragulaService: DragulaService) {
    this.events.subscribe('valueUpdate', data => this.updateLabel(data.key))
  }

  ngAfterViewInit() {
    this.questionKey = this.question.controlName
    this._generateSelectOptions()
    this._generateMultipleValues()
    this._prepareDynamicText()
    // run any custom onInit triggers
    if (this.question.triggers && this.question.triggers.trigger == "onInit") { this._runCustomTriggers() }
    this.cdr.detectChanges()
    // set dragula drop interaction (ideally should be split into seperate subcomponent extending question base)
    if (this.question.options && this.question.options.dragDrop) {
      this._addDragDropSubscriber()
    }
  }
  _addDragDropSubscriber() {
    // automatically save form values when rearranged using drag drop. Push final sampling unit back to array and reverse 
    this.dragulaService.dropModel.subscribe(_ => {
      let v = []
      this.multipleTextValues.forEach(val=>v.push(val))
      v.push('Final Sampling Unit')
      console.log('v', v)
      let patch = {}
      patch[this.question.controlName] = v
      this.formGroup.patchValue(patch)
      console.log('formgroup', this.formGroup)
    })

  }
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

  saveValue() {
    // save value on update (do not exclude "" in case user might have deleted a value)
    let value = this.formGroup.value[this.question.controlName]
    let update = { controlName: this.question.controlName, value: value, section: this.question.section }
    // publish key-value pair in event picked up by data provider to update
    this.events.publish('valueUpdate', update)
    this.events.publish('valueUpdated:' + update.controlName, update)
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
      this.formGroup.patchValue(patch)
    })
  }



  _generateSelectOptions() {
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
      let value = this.formGroup.value[this.question.controlName]
      if (value != "") {
        if (this.selectOptionsArray.indexOf(value) == -1) {
          // this.showSelectOther=true
          this.selectOtherValue = value
        }
      }
    }
  }
  _generateMultipleValues() {
    if (this.question.type == "textMultiple") {
      let value = this.formPrvdr.getSurveyValue(this.questionKey)
      if (value == undefined || value == "" || !value == null) {
        value = []
      }
      // remove initial FSU entry if available as added on later
      let i = value.indexOf('Final Sampling Unit')
      if(i>-1){
       value.splice(i,1)
      }
      this.multipleTextValues = value
    }
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
          currentValue: this.formGroup.value[val]
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

  addTextMultiple() {
    // push response to array
    this.multipleTextValues.unshift(this.multipleTextInput)
    this.multipleTextInput = "";
    let patch = {}
    patch[this.questionKey] = this.multipleTextValues
    this.formGroup.patchValue(patch)
    // notify for anything trying to monitor changes to array (e.g. repeat groups)
    this.events.publish('arrayChange:' + this.questionKey, { controlName: this.questionKey, type: 'push', value: this.multipleTextValues })
    this.saveValue()
  }
  removeTextMultiple(index) {
    this.multipleTextValues.splice(index, 1)
    let patch = {}
    patch[this.questionKey] = this.multipleTextValues
    this.formGroup.patchValue(patch)
    // notify for anything trying to monitor changes to array (e.g. repeat groups)
    this.events.publish('arrayChange:' + this.questionKey, { controlName: this.questionKey, type: 'splice', index: index, value: this.multipleTextValues })
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
