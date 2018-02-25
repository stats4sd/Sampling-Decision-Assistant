import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SurveyQuestionComponent } from '../../survey-question/survey-question';
import { FormArray, FormControl } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import { Events } from 'ionic-angular';
import { FormProvider } from '../../../../providers/form/form';
import { DataProvider } from '../../../../providers/data/data';

/*
Custom component to add multiple stages, populate repeat formgroup and give option to remove or reorder
*/

@Component({
  selector: 'question-custom-stages-define',
  templateUrl: 'question-custom-stages-define.html'
})
export class QuestionCustomStagesDefineComponent extends SurveyQuestionComponent {

  @Input() set preloadValue(v: any[]) {
    if (v) { this.setSavedValue(v) }
  }
  constructor(
    // repeat parent constructor to add additional dragula service
    private dragulaService: DragulaService,
    cdr: ChangeDetectorRef,
    events: Events,
    public formPrvdr: FormProvider,
    public dataPrvdr: DataProvider,
  ) {
    super(cdr, events, formPrvdr, dataPrvdr)
  }
  stages:any[]=[]
  dragulaOptions = {
    moves: function (el, source, handle, sibling) {
      return handle.parentElement.dataset.dragHandle == 'drag';
    },
  }
  finalSamplingUnit: string = "";
  valueControl: string = "q5.2";
  repeatControl: string = "q5.3";
  repeatFormArray: FormArray = this.formPrvdr.formGroup.controls[this.repeatControl] as FormArray


  ngOnInit() {
    // preload additional data before component rendered. hooks after input() sets so 
    // all need to call after initial set value input
    this.finalSamplingUnit = this.formPrvdr.formGroup.value['q3.1'] == '' ? 'Final Sampling Unit' : this.formPrvdr.formGroup.value['q3.1']
    this.preloadValues()
  }
  ngAfterViewInit() {
    this._addDragDropSubscriber()
  }

  preloadValues(){
    this.repeatFormArray.controls.forEach(control => {
      let stage = control.value._parentID
      this.stages.push(stage)
    });
    if(this.stages.length==0){this.addSamplingStage(this.finalSamplingUnit)}
  }

  patchForm(){
    let patch = {}
    patch[this.valueControl]=this.stages
    this.formPrvdr.formGroup.patchValue(patch)
    console.log('form',this.formPrvdr.formGroup)
  }

  addSamplingStage(name?) {
    // push response to array
    if (!name) { name = this.multipleTextInput }
    if (name == '') { name = "Final Sampling Unit" }
    let repeatFormGroup = this.formPrvdr.generateRepeatFormGroup(this.repeatControl, name)
    this.multipleTextInput = ""
    this.repeatFormArray.insert(0, repeatFormGroup)
    this.stages.unshift(name)
    this.patchForm()
  }

  removeSamplingStage(index, value) {
    let formArray: FormArray = this.formPrvdr.formGroup.controls[this.repeatControl] as FormArray
    formArray.removeAt(index)
    this.stages.splice(index,1)
  }

  setSavedValue(value: any) {
    // set saved value templates for when loading value from saved
    this.stages=value
  }

  reorderBuildStages() {
    let orderedControls=[]
    this.stages.forEach(stage=>{
      let control = this._getControl(stage)
      orderedControls.push(control)
    })
    orderedControls.forEach((control,i)=>{
      this._setControl(i,control)
    })
  }

  _getControl(id) {
    let formArray: FormArray = this.formPrvdr.formGroup.controls['q5.3'] as FormArray
    for (let control of formArray.controls) {
      if (control.value._parentID == id) { return control }
    }
  }
  _setControl(index: number, control: FormControl) {
    let formArray: FormArray = this.formPrvdr.formGroup.controls['q5.3'] as FormArray
    formArray.setControl(index, control)
  }

  _addDragDropSubscriber() {
    // automatically save form values when rearranged using drag drop. Push final sampling unit back to array and reverse 
    this.dragulaService.dropModel.subscribe(_ => {
      this.reorderBuildStages()
      this.patchForm()
    })
    
  }


}
