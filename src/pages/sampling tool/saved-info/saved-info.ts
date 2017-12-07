import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { DataProvider} from '../../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-saved-info',
  templateUrl: 'saved-info.html',
})
export class SavedInfoPage {
  saveName:string;
  view:string;
  savedSurveys:any;
  errorMsg:string;
  savedArray=[];

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private dataPrvdr:DataProvider) {
    this.view=this.navParams.data.view;
    this.loadSavedSurveys()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedInfoPage');
  }
  createNew(){
    console.log('creating new',this.saveName)
    if(this.savedSurveys[this.saveName]){
      this.errorMsg="A project with that name already exists"
    }
    else{
      this.dataPrvdr.createNewSurvey(this.saveName)
      this.viewCtrl.dismiss({_title:this.saveName})
    }
    
  }
  dismiss(){
    this.viewCtrl.dismiss()
  }
  loadSurvey(survey){
    this.dataPrvdr.setActiveSurvey(survey);
    this.viewCtrl.dismiss(survey);
  }
  deleteSurvey(survey){
    console.log('deleting survey',survey._title)
    this.dataPrvdr.deleteSurvey(survey._title)
    this.loadSavedSurveys()
  }
  loadSavedSurveys(){
    this.savedSurveys=this.dataPrvdr.savedSurveys;
    if(this.savedSurveys){
      let arr = []
      Object.keys(this.savedSurveys).forEach(key=>{
        arr.push(this.savedSurveys[key])
      })
      this.savedArray = arr.reverse();
      console.log('saved surveys',this.savedSurveys)
    }
  }

}
