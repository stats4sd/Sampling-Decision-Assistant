import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, Events, AlertController } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data';
import { FileDropModule, UploadFile, UploadEvent } from 'ngx-file-drop';
import { read } from 'xlsx/types';

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

  constructor(
    public viewCtrl: ViewController, 
    public navParams: NavParams, 
    private dataPrvdr: DataProvider, 
    public events:Events,
    public alertCtrl:AlertController
  ) {
    this.view = this.navParams.data.view;
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
  setView(view) { this.view = view }
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
  dropped(e:UploadEvent) {
    // handle file drop
    let files = e.files;
    this.events.subscribe('import:duplicate',project=>{
      console.log('duplicate file',project)
      this.promptRename(project)
    })
    this.events.subscribe('import:complete',_=>{
      this.loadSavedSurveys()
    })
    this.dataPrvdr.import(files)
  }
  fileOver(e) {  }
  fileLeave(e) { }

  promptRename(project){
    let prompt = this.alertCtrl.create({
      title:'Notification',
      message:'A project with this name already exists. Please rename.',
      enableBackdropDismiss:false,
      inputs:[{
        name:'title',
        placeholder:'title',
        value:project.title
      }],
      buttons: [
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked',data.title);
            if(data.title!=project.title){return true}
            else{return false}
          }
        }
      ]
    })
    prompt.onDidDismiss(data=>{
      console.log('prompt dismissed',data)
      this.events.publish('project:rename',data.title)
      //this.events.unsubscribe('import:duplicate')
    })
    prompt.present()
  }

}
