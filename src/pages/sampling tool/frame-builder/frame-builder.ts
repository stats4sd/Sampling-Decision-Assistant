import { Component } from '@angular/core';
import { IonicPage,  NavParams, ViewController } from 'ionic-angular';
import { DataProvider} from '../../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-frame-builder',
  templateUrl: 'frame-builder.html',
})
export class FrameBuilderPage {
  builderStage:any={}


  constructor(public viewCtrl: ViewController, public navParams: NavParams, private dataPrvdr:DataProvider) {
    this.builderStage=navParams.data
    console.log('builderStage',this.builderStage)
  }

  dismiss(){
    console.log('dismissing')
    this.dataPrvdr.saveSurvey()
    this.viewCtrl.dismiss()
  }

}
