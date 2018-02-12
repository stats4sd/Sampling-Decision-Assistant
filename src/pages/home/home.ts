import { Component, ViewChild, OnChanges } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import {ChangelogPage} from '../../pages/_changelog/changelog'

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  sections: any = []
  altSections: any = [];
  version: string = this.changeLog.version;
  date: string = this.changeLog.date;

  imageSrc = "assets/img/feature-image-1.jpg"
  // no longer using slides
  //@ViewChild(Slides) slides: Slides;

  constructor(
    private changeLog:ChangelogPage,
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataPrvdr: DataProvider,
    public modalCtrl: ModalController,

  ) {

    this.sections = [

      { name: "Use the tool", page: "StepByStepPage" },
      { name: "View the Tutorial", page: "StepByStepPage", params: "tutorialMode" },
      // {name:"Step by step mode", page:"StepByStepPage"},
      // {name:"Question-based mode", page:"QuestionsPage"}

    ]

    this.altSections = [
      { name: "Who is this tool for?", page: "About", class: "disabled" },
      { name: "Glossary of technical terms", page: "GlossaryPage" },
      { name: "Sample size trade-off tool", page: "SampleSizePage", class: "disabled" },
    ];
  }


  ionViewDidLoad() {
    // prevent user swiping (no longer using slides)
    //this.slides.lockSwipes(true)

  }
  // 
  goToSection(section) {
    if (section.class != "disabled") {
      this.navCtrl.push(section.page, section.params)
    }

  }
  showChangelog() {
    this.navCtrl.push('ChangelogPage')
  }

}

//nextSlide(){
  //   // transition locked slides
  //   this.slides.lockSwipes(false)
  //   this.slides.slideNext()
  //   this.slides.lockSwipes(true)
  // }
