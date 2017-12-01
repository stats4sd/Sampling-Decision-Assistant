import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  sections: any = []
  altSections: any = []

  imageSrc="assets/img/feature-image-1.jpg"
  @ViewChild(Slides) slides: Slides;

constructor(public navCtrl: NavController, public navParams: NavParams, private dataPrvdr: DataProvider) {

    this.sections=[
      {name:"Use the step-by-step assistant to plan your sampling", page:"OverviewPage"},
      {name:"Sampling Checklist - Quick Review", page:"QuestionsPage"}

    ]

    this.altSections=[
      {name:"How to use this guide", page:"HowToPage"},
      {name:"Training index", page:"TrainingIndexPage"},
      {name:"Glossary of technical terms", page:"GlossaryPage"},
      {name: "Sample side trade-off tool", page:"SampleSizePage"},
    ];


    console.log("this.sections", this.sections);
    console.log("this.altSections", this.altSections)

  }


  ionViewDidLoad(){
    // prevent user swiping
    this.slides.lockSwipes(true)

  }
  nextSlide(){
    this.slides.lockSwipes(false)
    this.slides.slideNext()
    this.slides.lockSwipes(true)
  }
  goToSection(section){
    this.navCtrl.push(section.page)
  }

}
