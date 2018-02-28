import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Events, Navbar, ModalController, ViewController, Content } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { DataProvider } from '../../../../providers/data/data';
import { FormProvider } from '../../../../providers/form/form'
// import { timeout } from 'ngx-file-drop/node_modules/rxjs/operators/timeout';
import animationStates from '../../../../providers/animationStates'



@IonicPage({
  segment: 'step-by-step/:stageID',
  defaultHistory: ['HomePage', 'StepByStepPage']
})
@Component({
  selector: 'page-stage',
  templateUrl: 'stage.html',
  animations: [animationStates]
})
export class StagePage {
  stage: any;
  stages:any;
  @ViewChild('slides') slides;
  @ViewChild('navbar') navbar: Navbar;
  @ViewChild('content') content: Content;
  activeSlide: string = "Main";
  activeGlossaryTerm: string;
  glossaryTerms = [];
  glossarySlug: string;
  modalMode: Boolean;
  form: FormGroup = this.formPrvdr.formGroup;
  section: any;
  refreshSlides: boolean;
  relevant:string
  loaded: boolean
  stagesComplete = this.dataPrvdr.activeSurvey.stagesComplete;
  slideOptions={}

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataPrvdr: DataProvider,
    public events: Events,
    public formPrvdr: FormProvider,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController
  ) {
    this.stageInit(navParams)
    this.events.subscribe('hash:changed', hash => this._hashChanged(hash))
    this.events.subscribe('help:clicked', relevant => this._showResource(relevant))

  }
  stageInit(navParams){
    let stageID = navParams.data.stageID
    this.modalMode = navParams.data.modalMode
    this.stages = {
      "stage-1": { name: "General objectives", title: "General Objectives", icon: "assets/img/icons/objectives.svg", number: 1 },
      "stage-2": { name: "Indicators", title: "Indicators", icon: "assets/img/icons/indicators.svg", number: 2 },
      "stage-3": { name: "Definition of the target population and units of study", title: "Target Population", icon: "assets/img/icons/population.svg", number: 3 },
      "stage-4": { name: "At what level do you need to report these results", title: "Reporting Results", icon: "assets/img/icons/reporting.svg", number: 4 },
      "stage-5": { name: "Selecting the sampling units", title: "Selecting and Reaching Sampling Units", icon: "assets/img/icons/outreach.svg", number: 5 },
      "stage-6": { name: "Allocating and deploying resources", title: "Allocating and deploying resources", icon: "assets/img/icons/allocate.svg", number: 6 },
    }
    this.stage = this.stages[stageID]
    this.section = this.stage.name
  }


  ionViewDidEnter() {
    //this.surveyValues = this.dataPrvdr.activeSurvey ? this.dataPrvdr.activeSurvey.values : {}
    this.slides.lockSwipes(true)
    this.slides.autoHeight=true;
    this.loaded = true
    this.navbar.backButtonClick = () => {
      let depth = location.hash.split('/').length
      if (depth > 3) { window.history.back() }
      else { this.navCtrl.pop() }
    }
  }


  goTo(section) {
    // update hash so that slides automatically go to correct section
    let hash = location.hash
    let arr = hash.split('/')
    if (arr.indexOf('section') == -1) {
      // in wrong section
      let depth = arr.length
      /* Depth varies between 3 and 4 if section selected
              /#/step-by-step/stage-1/section
      */
      if (section == 'main') {
        location.hash = arr.slice(0, 3).join('/')
      }
      else {
        // append to main
        if (depth < 4) { location.hash = location.hash + '/' + section }
        // replace
        else { location.hash = arr.slice(0, 3).join('/') + '/' + section }
      }
    }
  }

  showGlossary(term: string) {
    this.activeGlossaryTerm = term;
    this.slides.slideTo(2)
  }
  openModal(component, params?) {
    console.log('openining modal', component, params)
    this.modalCtrl.create(component, params).present()
  }
  closeModal() {
    this.dataPrvdr.backgroundSave()
    this.viewCtrl.dismiss()
  }
  scrollDown() {
    setTimeout(() => {
      console.log('scrolling down')
      try {
        this.content.scrollToBottom(1000)
      } catch (err) { console.log('err', err) }
    }, 500);
  }

  _showResource(relevant) {
    this.relevant = relevant;
    let arr = location.hash.split('/')
    if (arr.indexOf('resources') == -1) {
      location.hash = location.hash + '/resources'
    }
  }

  _hashChanged(hash) {
    // update slide on hash change. no slide changed tracking needed as swipes disabled (all nav programmatic)
    if (this.slides && this.loaded) {
      this.slides.lockSwipes(false)
      let arr = hash.split('/')
      // glossary tab
      if (arr.indexOf('glossary') > -1) {
        this.slides.slideTo(2); this.activeSlide = "Glossary";
        if (arr[arr.length - 1] != 'glossary') { this.glossarySlug = arr[arr.length - 1] }
        else { this.glossarySlug = "_" }

      }
      // resources tab
      else if (arr.indexOf('resources') > -1) { this.slides.slideTo(1); this.activeSlide = "Resources" }
      // main tab
      else {
        this.slides.slideTo(0); this.activeSlide = "Main"
      }
      this.slides.lockSwipes(true)
    }
  }
}
