import { Component, ViewChild, OnChanges } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController, ToastController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import version from '../../pages/changelog/version'

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  sections: any = []
  altSections: any = [];
  version: any = version;

  imageSrc = "assets/img/feature-image-1.jpg"
  // no longer using slides
  //@ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataPrvdr: DataProvider,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController

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
  ngOnInit() {
    this.checkForUdates()
  }
  // 
  goToSection(section) {
    if (section.class != "disabled") {
      this.navCtrl.push(section.page, section.params)
    }
  }

  showChangelog() {
    this.navCtrl.push('ChangelogPage')
    // throw new Error('I am a bug... 🐛')
  }

  goToAdmin() {
    this.navCtrl.push('AdminPage')
  }

  checkForUdates() {
    // https://medium.com/progressive-web-apps/pwa-create-a-new-update-available-notification-using-service-workers-18be9168d717
    //   window['isUpdateAvailable']()
    //     .then(isAvailable => {
    //       console.log('update available?', isAvailable)
    //       if (isAvailable) {
    //         const toast = this.toastCtrl.create({
    //           message: 'New Update available! Reload the webapp to see the latest juicy changes.',
    //           position: 'bottom',
    //           showCloseButton: true,
    //         });
    //         toast.present();
    //       }
    //     },
    //       notAvailable => { console.log('no update available') }
    //     ).catch(

    //       err => console.error(err)
    //     )
    // }

  }
}

//nextSlide(){
  //   // transition locked slides
  //   this.slides.lockSwipes(false)
  //   this.slides.slideNext()
  //   this.slides.lockSwipes(true)
  // }
