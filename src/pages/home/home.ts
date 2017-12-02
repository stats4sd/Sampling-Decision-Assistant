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
  // no longer using slides
  //@ViewChild(Slides) slides: Slides;

constructor(public navCtrl: NavController, public navParams: NavParams, private dataPrvdr: DataProvider) {

    this.sections=[
      {name:"Use step-by-step", page:"OverviewPage"},
      {name:"Quick review", page:"QuestionsPage"}

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
    // prevent user swiping (no longer using slides)
    //this.slides.lockSwipes(true)

  }
  // 
  goToSection(section){
    this.navCtrl.push(section.page)
  }

}

//nextSlide(){
  //   // transition locked slides
  //   this.slides.lockSwipes(false)
  //   this.slides.slideNext()
  //   this.slides.lockSwipes(true)
  // }
