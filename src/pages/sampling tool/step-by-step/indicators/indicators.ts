import { Component, ViewChild } from '@angular/core';
import { IonicPage, Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-indicators',
  templateUrl: 'indicators.html',
})
export class IndicatorsPage {
  @ViewChild(Slides) slides: Slides;
  activeSlide:string="Main";
  activeGlossaryTerm:string;
  glossaryTerms=["estimation"]
  section = "Indicators";

  placeholderText = `Text box to enter main decision at this stage. Will be used to create a summary of the sampling process that is designed. Editable and with no limit for the amount of text`

  constructor() {
  }

 // slides functions (currently copied onto all sections)
 slideChanged() {
  let sections:any=[
    {label:'Main',slideIndex:0},
    {label:'Resources',slideIndex:1},
    {label:'Glossary',slideIndex:2},
  ]
  let currentIndex = this.slides.getActiveIndex();
  this.activeSlide=sections[currentIndex].label;
}
slideTo(index){
  this.slides.lockSwipes(false)
  this.slides.slideTo(index)
  this.slides.lockSwipes(true)
}
ngAfterViewInit(){
  this.slides.lockSwipes(true)
}
// save functions (currently copied onto all slides)
ionViewWillLeave(){
  
}

}
