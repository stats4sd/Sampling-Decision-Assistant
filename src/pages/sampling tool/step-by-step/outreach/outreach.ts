import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { DataProvider } from '../../../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-outreach',
  templateUrl: 'outreach.html',
})
export class OutreachPage {
  @ViewChild(Slides) slides: Slides;
  activeSlide:string="Main";
  activeGlossaryTerm:string;
  glossaryTerms=[];
  surveyValues:any;
  section = "Selecting and reaching units"

  constructor(private dataPrvdr:DataProvider) {
    
  }

  ionViewDidEnter() {
    this.surveyValues=this.dataPrvdr.activeSurvey ? this.dataPrvdr.activeSurvey.values : {}
    console.log('survey values',this.surveyValues)
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
    this.slides.slideTo(index)
  }
  showGlossary(term: string) {
    this.activeGlossaryTerm=term;
    console.log('setting active glossary term',term)
    this.slides.slideTo(2)
  }

}
