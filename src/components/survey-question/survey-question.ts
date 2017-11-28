/* Takes a question and binds to appropriate input mechanism 
Additional features:
- auto-save on focusout or change for all elements
- automatic resize for textareas
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { query } from '@angular/core/src/animation/dsl';



@Component({
  selector: 'survey-question',
  templateUrl: 'survey-question.html'
})
export class SurveyQuestionComponent {
  @Input('question') question;
  @Input('formGroup') formGroup: FormGroup
  @ViewChild('textAreaInput') textAreaInput: ElementRef
  value: any;
  selectOtherValue:any;
  selectOptionsArray: string[];
  initialScrollHeight:number


  constructor() {

  }
  ngAfterViewInit() {
    this._generateSelectOptions()
  }
  valueUpdated(e) {
    console.log(this.question.controlName, this.value)
  }
  _generateSelectOptions() {
    // parse select options to array
    if (this.question.selectOptions != "") {
      let options = this.question.selectOptions.split(",")
      // trim whitespace at start if present
      options = options.map(el => { return el.trim() })
      this.selectOptionsArray = options
      console.log('select options array', this.selectOptionsArray)
    }
  }
  updateSelectOther(e){
    let value = e.target.value
    this.selectOtherValue=value
    this.value=value
   
  }
  
  resize() {
    // increase height on text area automatically except when first entry row (looks jumpy otherwise as 10px increase on first char)
    let scrollHeight=this.textAreaInput.nativeElement.scrollHeight
    if(!this.initialScrollHeight){this.initialScrollHeight=scrollHeight}
    if(scrollHeight>this.initialScrollHeight){
      console.log('resizing')
      this.textAreaInput.nativeElement.style.height = 'auto'
      this.textAreaInput.nativeElement.style.height = this.textAreaInput.nativeElement.scrollHeight + 10 + 'px';
    }
    
  }









}
