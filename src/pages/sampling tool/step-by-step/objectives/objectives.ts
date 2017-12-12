import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Slides } from 'ionic-angular';
import { DataProvider } from '../../../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-objectives',
  templateUrl: 'objectives.html',
})
export class ObjectivesPage {
  @ViewChild(Slides) slides: Slides;
  activeSlide:string="Main";
  activeGlossaryTerm:string;
  glossaryTerms=["estimation"];
  section = "General objectives";


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataPrvdr: DataProvider, private modalCtrl: ModalController) {
  }
  ionViewDidEnter(){
    
    
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
    // let modal = this.modalCtrl.create("GlossaryPage", { term: term });
    // modal.present();
  }

}
