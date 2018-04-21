import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Events, Navbar, ModalController, ViewController, Content } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { DataProvider } from '../../../providers/data/data';
import { FormProvider } from '../../../providers/form/form'
// import { timeout } from 'ngx-file-drop/node_modules/rxjs/operators/timeout';
import animationStates from '../../../providers/animationStates'
import { ProjectActions, ViewActions } from '../../../actions/actions';
import { Project, AppState } from '../../../models/models';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { CustomRouterProvider } from '../../../providers/router/router';



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
  stages: any;
  @ViewChild('navbar') navbar: Navbar;
  @ViewChild('content') content: Content;
  @ViewChild('stageSlides') stageSlides: Slides;
  @select(['activeProject', 'values']) readonly formValues$: Observable<any>;
  @select(['view', 'params', 'tabSection']) readonly tabSection$: Observable<any>;
  @select(['view', 'params', 'stagePart']) readonly stagePart$: Observable<string>;
  stagePart: string;
  activeSection: string = "main";

  activeGlossaryTerm: string;
  // glossaryTerms = [];
  // glossarySlug: string;
  form: FormGroup = this.formPrvdr.formGroup;
  section: any;
  // refreshSlides: boolean;
  relevant: string
  loaded: boolean
  // slideOptions = {}
  // stageSlidesIndex: number = 0

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataPrvdr: DataProvider,
    public events: Events,
    public formPrvdr: FormProvider,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public projectActions: ProjectActions,
    public viewActions: ViewActions,
    public ngRedux: NgRedux<AppState>,
    public customRouter: CustomRouterProvider
  ) {
    // part of workaround for router locked params #114
    this.customRouter.unlockParams()
    this.stageInit(navParams)
    // this.events.subscribe('help:clicked', relevant => this._showResource(relevant))
    this._subscribeToViewChanges()
  }



  stageInit(navParams) {
    let stageID = navParams.data.stageID
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
    this.viewActions.updateView({ activeStageID: stageID })
  }


  ionViewDidEnter() {
    this.loaded = true
    this._addBackButtonFunction()
  }

  // handle routing between main/resource/glossary sections using hash query params (changes subscribed to in _subscribeToViewChanges)
  goTo(section: 'resources' | 'glossary') {
    if (section) {
      this.customRouter.updateHashParams({
        tabSection: section
      })
    }
    else {
      this.customRouter.removeHashParam('tabSection')
    }
  }

  _subscribeToViewChanges() {
    this.tabSection$.subscribe(
      section => this.activeSection = section ? section : 'main'
    )
    this.stagePart$.subscribe(
      p => { this.stagePart = p })
  }

  // custom intercept for back button to handle going back in sections vs nav pop
  _addBackButtonFunction() {
    // if in main section pop, otherwise go to main
    this.navbar.backButtonClick = () => {
      this.customRouter.unlockParams()
      let section = location.hash.split('tabSection=')[1]
      if (section) {
        window.history.back()
      }
      else {
        this.navCtrl.pop()
      }
    }
  }

  openModal(component, params?) {
    this.modalCtrl.create(component, params).present()
  }

  closeModal() {
    this.dataPrvdr.backgroundSave()
    this.viewCtrl.dismiss()
  }

  pushPage(component, params) {
    this.navCtrl.push(component, params)
  }

  // click handler to move to next part of stage subsection
  nextStep() {
    // unlock nav params if locked (#114)
    this.customRouter.unlockParams()
    // first part (0) undefined so just go part 1
    if (!this.stagePart) {
      this.customRouter.updateHashParams({ stagePart: 1 })
    }
    // otherwise increment part and update
    else {
      try {
        let nextPart = parseInt(this.stagePart) + 1
        this.customRouter.updateHashParams({ stagePart: nextPart })
      } catch (error) {
        console.error(error)
      }
    }
  }

  // scrollDown() {
  //   setTimeout(() => {
  //     try {
  //       this.content.scrollToBottom(1000)
  //     } catch (err) { console.log('err', err) }
  //   }, 500);
  // }

  // _showResource(relevant) {
  //   this.relevant = relevant;
  //   let arr = location.hash.split('/')
  //   if (arr.indexOf('resources') == -1) {
  //     location.hash = location.hash + '/resources'
  //   }
  // }
}
