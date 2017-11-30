import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-indicators',
  templateUrl: 'indicators.html',
})
export class IndicatorsPage {
  @ViewChild(Slides) slides: Slides;
  sections:any=[
    {label:'More',slideIndex:0},
    {label:'Audio',slideIndex:1},
    {label:'Video',slideIndex:2},
    {label:'Pros & Cons',slideIndex:3},
  ]
  activeSlide:number=0
  placeholderText = `Text box to enter main decision at this stage. Will be used to create a summary of the sampling process that is designed. Editable and with no limit for the amount of text`

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndicatorsPage');
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.activeSlide=currentIndex
  }
  slideTo(index){
    this.slides.slideTo(index)
  }

}
