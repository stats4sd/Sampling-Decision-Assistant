import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionBaseComponent } from '../question-base/question-base';
import { FormGroup } from '@angular/forms';

/*
Custom component to display list of options from previous question with own input
Note, uses formPrvdr.formGroup as well as formGroup as latter binds to repeat group
*/

@Component({
  selector: 'question-custom-strata-select',
  templateUrl: 'question-custom-strata-select.html'
})
export class QuestionCustomStrataSelectComponent extends QuestionBaseComponent {
  @Input() set value(value: any) {
    this.getReportingLevels()
    this.setSavedValue(value)
  }
  @Output() valueUpdated = new EventEmitter<any>();
  selected: any = {}
  customStrata: string[] = []
  strataInput: string;
  reportingLevels: any[] = []

  ngOnInit() {
    // preload additional data before component rendered. hooks after input() sets so 
    // all need to call after initial set value input
    this.getReportingLevels()
  }
  getReportingLevels(){
    this.reportingLevels = this.getValue('q4.2')
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
    this.valueUpdated.emit(selectedArray);
  }

}
