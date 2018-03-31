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
  // @Input() set preloadValue(v: any[]) {
  //   if (v) { this.setSavedValue(v) }
  // }
  @Input('preloadValue') preloadValue: any[]
  // _parentID: string;
  finalSamplingUnit:string;
  isFinalStage: boolean;
  finalChecked: any = {}

  ngOnInit() {
    // preload additional data before component rendered. hooks after input() sets so 
    // all need to call after initial set value input
    this.getReportingLevels()
    this.setSavedValue(this.preloadValue)
    // this._parentID = this.formGroup.value._parentID
    this.checkIfFinalStage(this.formGroup.value.name)
    this.checkAlreadySelected()
    if(this.isFinalStage){this.setFinalStageLevels()}  
  }

  getReportingLevels() {
    // get reporting levels from stage 4, push names into array fo data binding
    let levels = this.formPrvdr.getSurveyValue('reportingLevels')
    if (levels == "") { levels = [] }
    levels.forEach(level => this.reportingLevels.push(level.name))
    console.log('reporting levels', this.reportingLevels)
  }

  checkAlreadySelected() {
    // iterates over other sampling stages disabling choices that have already been selected (not including fsu)
    let stages: any[] = this.formPrvdr.getSurveyValue('samplingStages')
    for (let stage of stages) {
      if (stage.name != this.formGroup.value.name && stage.name!=this.finalSamplingUnit) {
        let selected = stage['q5.3.4.2']
        if (selected && selected != "") {
          selected.forEach(val => {
            this.alreadySelected[val] = true
          })
        }
      }
    }
  }

  checkIfFinalStage(stageName) {
    // if final stage note and preselect values to be all remaining levels
    let stages = this.formPrvdr.getSurveyValue('samplingStages')
    this.finalSamplingUnit = stages[stages.length - 1].name
    if (stageName == this.finalSamplingUnit) {
      this.isFinalStage = true
    }
  }

  setFinalStageLevels(){
    // automatically indicate any outstanding levels will be selected and attach to final sampling unit
    this.selected={}
    this.reportingLevels.forEach(level => {
      if (!this.alreadySelected[level]) { 
        this.finalChecked[level] = true 
        this.selected[level]=true
      }
    })
    this.selectedChanged()
  }

  selectedChanged() {
    let selectedArray = []
    for (let key of Object.keys(this.selected)) {
      if (this.selected[key]) { selectedArray.push(key) }
    }
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

  setSavedValue(values: any[] = []) {
    // set saved value templates for when loading value from saved
    // sometimes initialised as empty string, ignore
    if (typeof values == "string") { return }
    console.log('setting saved values', values)
    values.forEach(value => {
      if (this.reportingLevels.indexOf(value) > -1) {
        this.selected[value] = true
      }
    })
    console.log('selected', this.selected)
  }

  // this.selected[value] = true
  // this.alreadySelected[value] = false
  // values.forEach(v => {
  //   console.log('v', v)
  //   if (this.reportingLevels.indexOf(v) == -1) {
  //     this.customStrata.push(v)
  //   }
  //   this.selected[v] = true
  // })
  // console.log('custom strata', this.customStrata)


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
