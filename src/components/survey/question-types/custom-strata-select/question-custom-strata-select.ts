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
  finalStage: string;
  isFinalStage: boolean;
  finalChecked:any={}


  ngOnInit() {
    // preload additional data before component rendered. hooks after input() sets so 
    // all need to call after initial set value input
    this.getReportingLevels()
    this._parentID = this.formGroup.value._parentID
    this.checkAlreadySelected()
    this.checkIfFinalStage(this._parentID)
    
  }
  getReportingLevels() {
    let levels = this.formPrvdr.getSurveyValue('reportingLevels')
    console.log('levels', levels)
    if (levels == "") { levels = [] }
    this.reportingLevels = levels
  }
  checkAlreadySelected() {
    let stages: any[] = this.formPrvdr.getSurveyValue('q5.3')
    for (let stage of stages) {
      if (stage._parentID != this._parentID) {
        let selected = stage['q5.3.4.2']
        if (selected != "") {
          selected.forEach(val => {
            this.alreadySelected[val] = true 
          })
        }
      }
    }
    console.log('already selected', this.alreadySelected)
  }
  checkIfFinalStage(stageName) {
    // if final stage note and preselect values to be all remaining levels
    let stages = this.formPrvdr.getSurveyValue('q5.2')
    this.finalStage = stages[stages.length - 1]
    console.log('stage name', stageName, 'final stage', this.finalStage)
    if (stageName == this.finalStage) {
      this.isFinalStage = true
      // automatically indicate any outstanding levels will be selected
      this.reportingLevels.forEach(level=>{
        if(!this.alreadySelected[level]){this.finalChecked[level]=true}
      })
      console.log('final levels',this.finalChecked)
    }
  }

  selectedChanged(e, v) {
    console.log('strata changed', this.selected)
    let selectedArray = []
    for (let key of Object.keys(this.selected)) {
      if (this.selected[key]) { selectedArray.push(key) }
    }
    console.log('selectedArray', selectedArray)
    // send output emitter to update value
    this.onValueChange.emit(selectedArray)
  }



  saveValue(value) {
    // directly patching to form as emitters not working properly
    // note in future all questions may function this way
    let patch = {}
    patch['q5.3.4.2'] = value
    this.formGroup.patchValue(patch)
    console.log('formGroup', this.formGroup)
  }


  setSavedValue(values: any[]) {
    // set saved value templates for when loading value from saved
    console.log('preloading values', values)
    values.forEach(value => {
      if (this.reportingLevels.indexOf(value) > -1) {
        this.selected[value] = true
      }
    })
    if (this.reportingLevels.length == 0) { this.getReportingLevels }
    // this.selected[value] = true
    // this.alreadySelected[value] = false
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

  //selectLevel(level) {
  // if (this.selected[level]) {
  //   // deselect others
  //   this.saveValue(level)
  //   Object.keys(this.selected).forEach(k => {
  //     if (k != level) { this.selected[k] = false }
  //   })
  // }
  // else {
  //   // check to see if any are selected, if not update form to be blank (assume previous selection captures newly selected)
  //   let s
  //   Object.keys(this.selected).forEach(k => {
  //     if (this.selected[k]) { s = k }
  //   })
  //   if (!s) {
  //     this.saveValue("")
  //   }
  // }
  //}

}
