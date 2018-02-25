import { Component } from '@angular/core';
import { IonicPage,  NavParams, ViewController } from 'ionic-angular';
import { DataProvider} from '../../../providers/data/data'
import { FormProvider} from '../../../providers/form/form'
import { FormGroup } from '@angular/forms';

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


  constructor(public viewCtrl: ViewController, public navParams: NavParams, private dataPrvdr:DataProvider, private formPrvdr:FormProvider) {
    console.log('framebuilder params',navParams)
    this.stageFormGroup=navParams.data.stageFormGroup
    this.stageName=this.stageFormGroup.value._parentID 
    this.stageRepeatIndex=navParams.data.stageIndex
    console.log('stage values',this.stageFormGroup.value)
  }

  dismiss(){
    console.log('dismissing')
    this.dataPrvdr.saveSurvey()
    this.viewCtrl.dismiss()
  }

}

