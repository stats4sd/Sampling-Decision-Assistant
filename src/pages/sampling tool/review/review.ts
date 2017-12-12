import { Component, ViewChildren, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController } from 'ionic-angular';

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


  constructor(private modalCtrl: ModalController) {
    // load question meta from questionMeta.ts and seperate out into question groups for binding to survey question components

  }
  ionViewDidLoad() {
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
  slideTo(index){
    this.slides.slideTo(index)
    this.viewSection=index;
  }
  slideChanged(){
    this.viewSection=this.slides.getActiveIndex();
  }
}






