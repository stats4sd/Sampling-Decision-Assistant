import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { DataProvider} from '../../../../providers/data/data'


@IonicPage()
@Component({
  selector: 'page-indicators',
  templateUrl: 'indicators.html',
})
export class IndicatorsPage {
  @ViewChild(Slides) slides: Slides;
  sections:any=[
    {label:'Intro',slideIndex:0},
    {label:'Resources',slideIndex:1},
    {label:'Glossary',slideIndex:2},
  ]
  activeSlide:number=0
  sectionMeta: any = {}
  placeholderText = `Text box to enter main decision at this stage. Will be used to create a summary of the sampling process that is designed. Editable and with no limit for the amount of text`

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataPrvdr:DataProvider) {
    // load section questions from data provider
    this.sectionMeta=this.dataPrvdr.getSectionMeta("Indicators")
    console.log('sectionMeta',this.sectionMeta)    
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.activeSlide=currentIndex
  }
  slideTo(index){
    this.slides.slideTo(index)
  }

}
