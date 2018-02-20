import { Component } from '@angular/core';
import { IonicPage,  NavParams, ViewController } from 'ionic-angular';
import { DataProvider} from '../../../providers/data/data'
import { FormProvider} from '../../../providers/form/form'

@IonicPage({
  segment: 'builder',
})
@Component({
  selector: 'page-frame-builder',
  templateUrl: 'frame-builder.html',
})
export class FrameBuilderPage {
  builderStage:any={}
  formGroup:any;


  constructor(public viewCtrl: ViewController, public navParams: NavParams, private dataPrvdr:DataProvider, private formPrvdr:FormProvider) {
    console.log('framebuilder params',navParams)
    this.builderStage=navParams.data 
    this.formGroup = this.formPrvdr.formGroup
    
    //this.formGroup=this.formPrvdr.formGroup
  }

  dismiss(){
    console.log('dismissing')
    this.dataPrvdr.saveSurvey()
    this.viewCtrl.dismiss()
    console.log('formGroup',this.formGroup)
  }

}

