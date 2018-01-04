import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';
import { FileDropModule, UploadFile, UploadEvent } from 'ngx-file-drop';

@IonicPage()
@Component({
  selector: 'page-saved-info',
  templateUrl: 'saved-info.html',
})
export class SavedInfoPage {
  saveName: string;
  view: string;
  savedSurveys: any;
  errorMsg: string;
  savedArray = [];

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private dataPrvdr: DataProvider) {
    this.view = this.navParams.data.view;
    console.log('file drop',FileDropModule)
    this.loadSavedSurveys()
  }

  ionViewDidLoad() {
  }
  createNew() {
    if (this.savedSurveys[this.saveName]) {
      this.errorMsg = "A project with that name already exists"
    }
    else {
      this.dataPrvdr.createNewSurvey(this.saveName)
      this.viewCtrl.dismiss({ title: this.saveName })
    }

  }
  setView(view){this.view=view}
  dismiss() {
    this.viewCtrl.dismiss()
  }
  loadSurvey(survey) {
    this.dataPrvdr.loadSurvey(survey);
    this.viewCtrl.dismiss(survey);
  }
  deleteSurvey(survey) {
    this.dataPrvdr.deleteSurvey(survey.title).then(
      _ => this.loadSavedSurveys()
    )

  }
  loadSavedSurveys() {
    this.savedSurveys = this.dataPrvdr.savedSurveys;
    if (this.savedSurveys) {
      let arr = []
      Object.keys(this.savedSurveys).forEach(key => {
        arr.push(this.savedSurveys[key])
      })
      this.savedArray = arr.reverse();
    }
    else { this.savedArray = [] }
  }
  // file drop
  dropped(e:UploadEvent){
    console.log('upload event',e)
    e.files[0].fileEntry.file(info=>{
      console.log('info',info)
    })
    this.dataPrvdr.import(e.files)
  }
  fileOver(e){

  }
  fileLeave(e){

  }

}
