import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import {DataProvider} from '../../../../providers/data/data'

@IonicPage({
  segment: 'step-by-step/:stageID',
  defaultHistory:['HomePage','StepByStepPage']
})
@Component({
  selector: 'page-stage',
  templateUrl: 'stage.html',
})
export class StagePage {
  stage:any;
  @ViewChild(Slides) slides: Slides;
  activeSlide:string="Main";
  activeGlossaryTerm:string;
  glossaryTerms=[];
  surveyValues:any;
  section:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataPrvdr:DataProvider ) {
    let stageID=navParams.data.stageID
    let stages={
      "stage-1":{name:"General objectives", title:"General Objectives", icon:"assets/img/icons/objectives.svg", page:"ObjectivesPage",number:1},
      "stage-2":{name:"Indicators", title:"Indicators", icon:"assets/img/icons/indicators.svg", page:"IndicatorsPage",number:2},
      "stage-3":{name:"Definition of the target population and units of study", title:"Target Population", icon:"assets/img/icons/population.svg", page:"TargetPopulationPage",number:3},
      "stage-4":{name:"At what level do you need to report these results", title:"Reporting Results", icon:"assets/img/icons/reporting.svg", page:"ReportingPage",number:4},
      "stage-5":{name:"Selecting and reaching the sampling units", title:"Selecting and Reaching Sampling Units", icon:"assets/img/icons/outreach.svg", page:"OutreachPage",number:5},
    }
    this.stage = stages[stageID]
    this.section = this.stage.name
    console.log('stage',this.stage)
  }


  ionViewDidEnter() {
    this.surveyValues=this.dataPrvdr.activeSurvey ? this.dataPrvdr.activeSurvey.values : {}
  }

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
  showGlossary(term: string) {
    this.activeGlossaryTerm=term;
    console.log('setting active glossary term',term)
    this.slides.slideTo(2)
  }

}
