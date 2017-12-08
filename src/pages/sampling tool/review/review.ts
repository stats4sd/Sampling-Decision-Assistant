import { Component, ViewChildren, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data'

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


  constructor(private dataPrvdr: DataProvider, private modalCtrl: ModalController) {
    // load question meta from questionMeta.ts and seperate out into question groups for binding to survey question components

  }
  ionViewDidLoad() {
    let meta = this.dataPrvdr.getSectionMeta()
    this.questionGroups = []
    Object.keys(meta).forEach(key => this.questionGroups.push(meta[key]));
    console.log('question grups', this.questionGroups)
  }


  startNew() {
    let modal = this.modalCtrl.create('SavedInfoPage', { view: 'save' });
    modal.onDidDismiss(data => {
      if (data) { this.showIntro = false }
    })
    modal.present()
  }
  load() {
    let modal = this.modalCtrl.create('SavedInfoPage', { view: 'load' });
    modal.onDidDismiss(data => {
      if (data) {
        console.log('survey loaded', data)
        let meta = this.dataPrvdr.getSectionMeta()
        this.questionGroups = []
        Object.keys(meta).forEach(key => this.questionGroups.push(meta[key]));
        this.showIntro = false
      }
    })
    modal.present()
  }
  save() {
    this.dataPrvdr.saveSurvey()
  }
  export(){
    this.dataPrvdr.export()
  }

  hideIntro() {
    this.showIntro = false;
  }
  slideTo(index){
    this.slides.slideTo(index)
    this.viewSection=index;
  }
  slideChanged(){
    this.viewSection=this.slides.getActiveIndex();
  }
}






