import { Component } from '@angular/core';
import { IonicPage,  NavParams, ViewController } from 'ionic-angular';
import { DataProvider} from '../../../providers/data/data'
import { FormProvider} from '../../../providers/form/form'
import { FormGroup, FormControl } from '@angular/forms';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs'

@IonicPage({
  segment: 'builder',
})
@Component({
  selector: 'page-frame-builder',
  templateUrl: 'frame-builder.html',
})
export class FrameBuilderPage {
  stageFormGroup:FormGroup;
  stageName:string;
  stageRepeatIndex:number;
  reportingLevels:any;
  @select(['activeProject','values','reportingLevels']) reportingLevels$ : Observable<any>

  /*
  this page handles the view of the repeat stage form builder and bindings to the correct element in the master form group.
  note, this binding could be handled in more generic way through repeat arrays and the repeat-group element (like how question
  creates dynamic controls on request) however it doesn't seem too necessary at this stage to generalise.
  */

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private dataPrvdr:DataProvider, private formPrvdr:FormProvider) {
    console.log('framebuilder params',navParams.data)
    this.stageRepeatIndex=navParams.data.stageIndex
    this.stageName = navParams.data.stageFormGroup.name
    this._buildFormGroup()
  }

  ngOnInit(){
    this._preloadValues()
    this._addValueSubscribers()
  }

  _buildFormGroup(){
    // generate a new formgroup which will be used to hold information saved in these questions
    
    let builderQuestions:any = this.formPrvdr.allQuestions
    builderQuestions = builderQuestions.filter(q=>{
      return q.repeatGroup=="q5.3"
    })
    let builderForm = this.formPrvdr._generateQuestionForm(builderQuestions)
    this.stageFormGroup = builderForm
  }

  _preloadValues(){
    let currentValue = this.formPrvdr.formGroup.value.samplingStages[this.stageRepeatIndex]
    Object.keys(currentValue).forEach(k=>{
      // build additional controls for thing like name and built status which aren't included in questions
      if(!this.stageFormGroup.controls[k]){
        this.stageFormGroup.addControl(k,new FormControl())
      }
    })
    this.stageFormGroup.patchValue(currentValue)
  }

  _addValueSubscribers(){
    // listen to changes on this formgroup and reflect on master
    this.stageFormGroup.valueChanges.subscribe(
      v=>{if(v){this._patchValue(v)}}
    )
    this.reportingLevels$.subscribe(levels=>this.reportingLevels=levels)
  }

  _patchValue(update:any){
    // update value on master group
    let currentValue = this.formPrvdr.formGroup.value.samplingStages
    Object.keys(update).forEach(k => {
      currentValue[this.stageRepeatIndex][k]=update[k]
    });
    this.formPrvdr.formGroup.patchValue({samplingStages:currentValue})
  }

  dismiss(){
    if(this.stageFormGroup.value['q5.3.1']){
      this._patchValue({_built:true})
    }
    
    this.dataPrvdr.backgroundSave()
    this.viewCtrl.dismiss()
  }

}

