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
    this.builderStage=navParams.data.index ? navParams.data : devDefaults
    this.formGroup=this.formPrvdr.formGroup
    console.log('builderStage',this.builderStage)
  }

  dismiss(){
    console.log('dismissing')
    this.dataPrvdr.saveSurvey()
    this.viewCtrl.dismiss()
  }

}
var devDefaults={
  index:0,
  title:'devTest' 
}
