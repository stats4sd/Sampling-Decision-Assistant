import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { DataProvider } from '../../../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-target-population',
  templateUrl: 'target-population.html',
})
export class TargetPopulationPage {
  @ViewChild(Slides) slides: Slides;
  activeSlide:string="Main";
  activeGlossaryTerm:string;
  glossaryTerms=[];

  sectionMeta:any={};

  constructor(public navCtrl: NavController, public navParams: NavParams,  private dataPrvdr: DataProvider) {
    this.sectionMeta=this.dataPrvdr.getSectionMeta("Definition of the target population and units of study")
    console.log('sectionMeta',this.sectionMeta)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TargetPopulationPage');
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
    this.slides.slideTo(2)
  }

}
