import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SurveyQuestionComponent } from '../../survey-question/survey-question';
import { FormArray, FormControl } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import { Events, TextInput } from 'ionic-angular';
import { FormProvider } from '../../../../providers/form/form';
import { DataProvider } from '../../../../providers/data/data';
import { select } from '@angular-redux/store'
import { Observable } from 'rxjs/Observable'

/*
Custom component to add multiple stages, populate repeat formgroup and give option to remove or reorder
*/

@Component({
  selector: 'question-custom-stages-define',
  templateUrl: 'question-custom-stages-define.html'
})
export class QuestionCustomStagesDefineComponent extends SurveyQuestionComponent {
  @select(['activeProject', 'values', 'q3.1']) readonly finalSamplingUnit$: Observable<string>
  @ViewChild('textMultipleInput') textMultipleInput: TextInput;
  multipleTextInput: string
  stages: any[] = []
  dragulaOptions = {
    moves: function (el, source, handle, sibling) {
      return handle.parentElement.dataset.dragHandle == 'drag';
    },
  }
  finalSamplingUnit: string = "";
  editMode: boolean;
  editIndex: number;
  // valueControl: string = "q5.2";
  // repeatControl: string = "q5.3";
  // repeatFormArray: FormArray = this.formPrvdr.formGroup.controls[this.repeatControl] as FormArray


  // @Input() set preloadValue(v: any[]) {
  //   if (v) { this.setSavedValue(v) }
  // }

  /************** custom reporting levels *********************************************************
  similar code and template to multiple text input, but builds form controls instead of string array
  could try find better way to combine/reuse code

  NOTE - have removed form array/repeat group bindings to keep things simpler, but may want to 
  add back in later
  *////////////////////////////////////////////////////////////////////////////////////////////////

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

  ngOnInit() {
    // preload additional data before component rendered. hooks after input() sets so 
    // all need to call after initial set value input
    // listen to fsu changes and update stages array appropriately
    this.finalSamplingUnit$.subscribe(fsu => { if (fsu) { console.log('fsu', fsu); this._init(fsu) } })
    this._init(this.formPrvdr.formGroup.value['q3.1'])
  }

  _init(fsu?) {

    let values = this.formPrvdr.formGroup.value
    if (!fsu) { fsu = 'Final Sampling Unit' }
    let stages
    // build group template if doesn't exist or undefined
    if (!values.samplingStages) {
      console.log('adding custom stages form control')
      this.formPrvdr.formGroup.addControl('samplingStages', new FormControl([{ name: fsu }]))
      stages = [{ name: fsu }]
    }

    else {
      console.log('copying sampling stages', values.samplingStages)
      // otherwise ensure final sampling unit named correctly
      try {
        stages = values.samplingStages.slice(0)
      } catch (error) {
        console.error('error', error)
      }
      if (stages.length > 0) {
        stages[stages.length - 1].name = fsu
      }
      else { stages = [{ name: fsu }] }
      console.log('stages', stages)
    }
    this.stages = stages
    this.finalSamplingUnit = fsu
    this.patchForm()
    //this.preloadValues()
  }
  ngAfterViewInit() {
    this._addDragDropSubscriber()
  }

  patchForm() {
    let form = this.formPrvdr.formGroup
    let patch: any = {}
    patch.samplingStages = this.stages
    // patch only works if exists so also provide option to add control
    console.log('patching form', patch)
    console.log('sampling stages',form.value.samplingStages)
    if (!form.value.samplingStages) {
      console.log('adding sampling stages form control')
      form.addControl('samplingStages', new FormControl())
    }
    form.patchValue(patch)
    console.log('form',form)
  }

  addSamplingStage(name?) {
    // push response to array
    if (!name) { name = this.multipleTextInput }
    if (name == '') { name = "Final Sampling Unit" }
    //let repeatFormGroup = this.formPrvdr.generateRepeatFormGroup(this.repeatControl, name)
    this.multipleTextInput = ""
    //this.repeatFormArray.insert(0, repeatFormGroup)
    // this.stages.unshift(name)
    this.stages.unshift({ name: name })
    this.patchForm()
  }

  removeSamplingStage(index, value) {
    // let formArray: FormArray = this.formPrvdr.formGroup.controls[this.repeatControl] as FormArray
    // formArray.removeAt(index)
    this.stages.splice(index, 1)
    this.patchForm()
  }

  enableEdit(i) {
    this.multipleTextInput = this.stages[i].name
    this.editMode = true
    this.editIndex = i
    this.textMultipleInput.setFocus()
  }
  saveEdits() {
    this.stages[this.editIndex].name = this.multipleTextInput
    this.multipleTextInput = ""
    this.editMode = false
    this.editIndex = -1
    this.patchForm()
  }

  _addDragDropSubscriber() {
    // automatically save form values when rearranged using drag drop. Push final sampling unit back to array and reverse 
    this.dragulaService.dropModel.subscribe(_ => {
      console.log('drop')
      // this.reorderBuildStages()
      this.patchForm()
    })
  }

  // preloadValues() {
  //   console.log('repeat form array', this.repeatFormArray)
  //   this.repeatFormArray.controls.forEach(control => {
  //     let stage = control.value._parentID
  //     this.stages.push(stage)
  //   });
  //   if (this.stages.length == 0) { this.addSamplingStage(this.finalSamplingUnit) }
  // }

  // setSavedValue(value: any) {
  //   // set saved value templates for when loading value from saved
  //   this.stages = value
  // }

  // reorderBuildStages() {
  //   let orderedControls = []
  //   this.stages.forEach(stage => {
  //     let control = this._getControl(stage)
  //     orderedControls.push(control)
  //   })
  //   orderedControls.forEach((control, i) => {
  //     this._setControl(i, control)
  //   })
  // }

  // _getControl(id) {
  //   let formArray: FormArray = this.formPrvdr.formGroup.controls['q5.3'] as FormArray
  //   for (let control of formArray.controls) {
  //     if (control.value._parentID == id) { return control }
  //   }
  // }

  // _setControl(index: number, control: FormControl) {
  //   let formArray: FormArray = this.formPrvdr.formGroup.controls['q5.3'] as FormArray
  //   formArray.setControl(index, control)
  // }



  // }


}
