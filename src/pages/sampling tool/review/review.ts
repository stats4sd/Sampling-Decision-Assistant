import { Component, ViewChildren, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import {DataProvider} from '../../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {
  questionGroups: any = [];
  @ViewChildren('survey') surveys;
  @ViewChild(Slides) slides: Slides;
  canvasImage: any;
  showIntro: boolean = true;
  viewSection:number=0;


  constructor(private modalCtrl: ModalController, private dataPrvdr:DataProvider) {
    // load question meta from questionMeta.ts and seperate out into question groups for binding to survey question components
    this._generateQuestionGroups()
  }
  

  _generateQuestionGroups(){
    let groups = {}
    this.dataPrvdr.questionMeta.forEach(q=>{
      if(!groups[q.section]){groups[q.section]={
        section:q.section
      }}
    })
    this.questionGroups= Object.keys(groups)
    console.log('question groups',this.questionGroups)
  }


  startNew() {
    let modal = this.modalCtrl.create('SavedInfoPage', { view: 'save' });
    modal.onDidDismiss(data => {
      if (data) { this.showIntro = false }
    })
    modal.present()
  }
 
  export(){
    this.dataPrvdr.export()
  }

  hideIntro() {
    this.showIntro = false;
  }
  ngAfterViewInit(){
    this.slides.lockSwipes(true)
  }
  slideTo(index){
    this.slides.lockSwipes(false)
    this.slides.slideTo(index)
    this.viewSection=index;
    this.slides.lockSwipes(true)
  }
  slideChanged(){
    this.viewSection=this.slides.getActiveIndex();
    this.dataPrvdr.backgroundSave();
  }
}






