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
  alreadySelected: any = {}
  selected: any = {}
  // customStrata: string[] = []
  // strataInput: string;
  reportingLevels: any[] = []
  @Input() set preloadValue(v: any[]) {
    if (v) { this.setSavedValue(v) }
  }
  _parentID: string;


  ngOnInit() {
    // preload additional data before component rendered. hooks after input() sets so 
    // all need to call after initial set value input
    this.getReportingLevels()
    this.checkAlreadySelected()
    this._parentID = this.formGroup.value._parentID
    console.log('parentID', this._parentID)
  }
  getReportingLevels() {
    let levels = this.formPrvdr.getSurveyValue('q4.2')
    console.log('levels', levels)
    if (levels == "") { levels = [] }
    this.reportingLevels = levels
  }
  checkAlreadySelected() {
    let stages: any[] = this.formPrvdr.getSurveyValue('q5.3')
    for (let stage of stages) {
      let selected = stage['q5.3.4.2']
      if (selected != "") {
        if (!this.selected[selected]) { this.alreadySelected[selected] = true }
      }
    }
    console.log('already selected', this.alreadySelected)
  }

  selectLevel(level) {
    if (this.selected[level]) {
      // deselect others
      this.saveValue(level)
      Object.keys(this.selected).forEach(k => {
        if (k != level) { this.selected[k] = false }
      })
    }
    else {
      // check to see if any are selected, if not update form to be blank (assume previous selection captures newly selected)
      let s
      Object.keys(this.selected).forEach(k => {
        if (this.selected[k]) { s = k }
      })
      if (!s) {
        this.saveValue("")
      }
    }
  }

  saveValue(value){
    // directly patching to form as emitters not working properly
    // note in future all questions may function this way
    let patch={}
    patch['q5.3.4.2']=value
    this.formGroup.patchValue(patch)
    console.log('formGroup',this.formGroup)
  }


  setSavedValue(value: any) {
    // set saved value templates for when loading value from saved
    console.log('preloading value', value)
    if (this.reportingLevels.length == 0) { this.getReportingLevels }
    this.selected[value] = true
    this.alreadySelected[value] = false
    console.log('selected', this.selected)

    // values.forEach(v => {
    //   console.log('v', v)
    //   if (this.reportingLevels.indexOf(v) == -1) {
    //     this.customStrata.push(v)
    //   }
    //   this.selected[v] = true
    // })
    // console.log('custom strata', this.customStrata)
  }


  // addStrata() {
  //   if (this.strataInput && this.customStrata.indexOf(this.strataInput) == -1) {
  //     this.customStrata.push(this.strataInput)
  //     this.selected[this.strataInput] = true
  //     this.strataInput = null
  //     this.strataChanged()
  //   }
  // }

  // strataChanged(e,v) {
  //   console.log('strata changed', this.selected)
  // let selectedArray = []
  // for (let key of Object.keys(this.selected)) {
  //   if (this.selected[key]) { selectedArray.push(key) }
  // }
  // console.log('selectedArray', selectedArray)
  // // send output emitter to update value
  // this.onValueChange.emit(selectedArray)
  // }


}
