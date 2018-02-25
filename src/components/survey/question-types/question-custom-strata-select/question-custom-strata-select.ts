import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() set preloadValue(v: any[]) {
    if (v) { this.setSavedValue(v) }
  }

  ngOnInit() {
    // preload additional data before component rendered. hooks after input() sets so 
    // all need to call after initial set value input
    this.getReportingLevels()
  }
  getReportingLevels() {
    let levels = this.formPrvdr.getSurveyValue('q4.2')
    console.log('levels',levels)
    if (levels == "") { levels = [] }
    this.reportingLevels = levels
  }
  setSavedValue(values: any[]) {
    // set saved value templates for when loading value from saved
    console.log('preloading value', values)
    if (this.reportingLevels.length==0) { this.getReportingLevels }
    values.forEach(v => {
      console.log('v', v)
      if (this.reportingLevels.indexOf(v) == -1) {
        this.customStrata.push(v)
      }
      this.selected[v] = true
    })
    console.log('selected', this.selected)
    console.log('custom strata', this.customStrata)
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
    this.onValueChange.emit(selectedArray)
  }

}
