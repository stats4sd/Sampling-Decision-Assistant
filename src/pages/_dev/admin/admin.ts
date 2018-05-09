import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {select} from '@angular-redux/store'
import {Observable} from 'rxjs'

@IonicPage({
  defaultHistory:['HomePage']
})
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  stageNumber:Number
  editorSection:string
  stages=[1,2,3,4,5,6];
  editMode:boolean
  @select('editMode') editMode$:Observable<boolean>

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.editMode$.subscribe(mode=>this.editMode=mode)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  editResources(i){
    this.stageNumber=i
    this.editorSection='resources'
    
  }
  editGlossary(){
    this.stageNumber=null
    this.editorSection='glossary'
  }

}
