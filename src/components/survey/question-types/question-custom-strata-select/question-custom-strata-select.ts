import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionBaseComponent } from '../question-base/question-base';
import { SurveyQuestionComponent } from '../../survey-question/survey-question';

/*
Custom component to display list of options from previous question with own input
*/

@Component({
  selector: 'question-custom-strata-select',
  templateUrl: 'question-custom-strata-select.html'
})
export class QuestionCustomStrataSelectComponent extends SurveyQuestionComponent {
  selected: any = {}
  customStrata: string[] = []
  strataInput: string;
  reportingLevels: any[] = []

  writeValue(value: any) {
    // custom write function to override survey-question
    this.setSavedValue(value)
  }

  ngOnInit() {
    // preload additional data before component rendered. hooks after input() sets so 
    // all need to call after initial set value input
    this.getReportingLevels()
  }
  getReportingLevels(){
    this.reportingLevels = this.formPrvdr.getSurveyValue('q4.2')
    console.log('reporting levels', this.reportingLevels)
  }
  setSavedValue(values: any[]) {
    // set saved value templates for when loading value from saved
    console.log('preloading value', values)
    for (let v of values) {
      if (this.reportingLevels.indexOf(v) == -1) {
        this.reportingLevels.push(v)
      }
      this.selected[v] = true
    }
  }


  addStrata() {
    if (this.strataInput && this.customStrata.indexOf(this.strataInput) == -1) {
      this.customStrata.push(this.strataInput)
      this.selected[this.strataInput] = true
      this.strataInput = null
      this.strataChanged()
    }
  }

  strataChanged() {
    console.log('strata changed', this.selected)
    let selectedArray = []
    for (let key of Object.keys(this.selected)) {
      if (this.selected[key]) { selectedArray.push(key) }
    }
    console.log('selectedArray', selectedArray)
    // send output emitter to update value
    this.valueUpdated(selectedArray);
  }

}
