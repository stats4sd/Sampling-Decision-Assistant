import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  sections: any = []
  altSections: any = [];
  version:string="0.3.2";

  imageSrc="assets/img/feature-image-1.jpg"
  // no longer using slides
  //@ViewChild(Slides) slides: Slides;

constructor(public navCtrl: NavController, public navParams: NavParams, private dataPrvdr: DataProvider) {

    this.sections=[
      {name:"Use the tool", page:"StepByStepPage", icon:"arrow-forward"},
      // {name:"Step by step mode", page:"StepByStepPage"},
      // {name:"Question-based mode", page:"QuestionsPage"}

    ]

    this.altSections=[
      {name:"How to use this guide", page:"HowToPage"},
      {name:"Glossary of technical terms", page:"GlossaryPage"},
      {name: "Sample size trade-off tool", page:"SampleSizePage", class:"disabled"},
    ];
  }


  ionViewDidLoad(){
    // prevent user swiping (no longer using slides)
    //this.slides.lockSwipes(true)

  }
  // 
  goToSection(section){
    if(section.class!="disabled"){
      this.navCtrl.push(section.page)
    }
    
  }

}

//nextSlide(){
  //   // transition locked slides
  //   this.slides.lockSwipes(false)
  //   this.slides.slideNext()
  //   this.slides.lockSwipes(true)
  // }
