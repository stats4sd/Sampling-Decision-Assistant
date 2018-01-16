import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Slides, Events } from 'ionic-angular';
import { DataProvider } from '../../../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-objectives',
  templateUrl: 'objectives.html',
})
export class ObjectivesPage {
  @ViewChild(Slides) slides: Slides;
  activeSlide: string = "Main";
  activeGlossaryTerm: string;
  glossaryTerms = ["estimation"];
  section = "General objectives";



  constructor(public navCtrl: NavController, public navParams: NavParams, private dataPrvdr: DataProvider, private modalCtrl: ModalController, public events:Events) {
    this._attachListeners()
  }
  ionViewDidEnter() {


  }


  _attachListeners(){
    // hash change
    
  }

  // slides functions (currently copied onto all sections)
  slideChanged() {
    let sections: any = [
      { label: 'Main', slideIndex: 0 },
      { label: 'Resources', slideIndex: 1 },
      { label: 'Glossary', slideIndex: 2 },
    ]
    let currentIndex = this.slides.getActiveIndex();
    this.activeSlide = sections[currentIndex].label;
    // reflect path on href
    location.href=location+'/'+sections[currentIndex].label
  }
  slideTo(index) {
    this.slides.lockSwipes(false)
    this.slides.slideTo(index)
    
    this.slides.lockSwipes(true)
  }
  ngAfterViewInit() {
    this.slides.lockSwipes(true)
  }
  showGlossary(term: string) {
    this.activeGlossaryTerm = term;
    this.slideTo(2)
    
    // let modal = this.modalCtrl.create("GlossaryPage", { term: term });
    // modal.present();
  }

}
