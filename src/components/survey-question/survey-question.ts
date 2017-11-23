/* Takes an array of questions and presents them as a formgroup

@Input('questions')

Array of question objects, with fields:

controlName: string (what to call form variables)
type: string (input type, currently accepts 'heading', 'text', 'select')
label: string (text to display as question label)
value?: any (default value to save)
selectOptions?: string[] (array of options to pass to select, single word list binds to both display name and value properties)


*/

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';



@Component({
  selector: 'survey-question',
  templateUrl: 'survey-question.html'
})
export class SurveyQuestionComponent {
  @Input('question') question;
  @Input('formGroup') formGroup:FormGroup
  value: any;
  selectOptionsArray: string[]


  constructor() {

  }
  ngAfterViewInit() {
    this._generateSelectOptions()

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









}
