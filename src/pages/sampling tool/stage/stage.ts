import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Slides,
  Navbar,
  ViewController,
  Content
} from "ionic-angular";
import { FormGroup } from "@angular/forms";
import { DataProvider } from "../../../providers/data/data";
import { FormProvider } from "../../../providers/form/form";
import { ViewActions, ProjectActions } from "../../../actions/actions";
import { select, NgRedux } from "@angular-redux/store";
import { Observable } from "rxjs";
import { CustomRouterProvider } from "../../../providers/router/router";
import { ResourcesProvider } from "../../../providers/resources/resources";
import { IStageResources, AppState, IStageMeta } from "../../../models/models";

const INTRO_HTML = {
  1: `You will identify the main objectives of the survey to help inform future decision making and identify how
  the tool can best be used. There will be <strong>1-3 questions</strong> to answer during this section`,
  2: `You will specify the indicator that will guide some of your decisions about sampling.`,
  3: `You will identify your target population and consider any additional criteria for exclusion or inclusion to
  make it as well-defined as possible`,
  4: `You will consider the reporting requirements for the data to be collected, to use as a basis for determining
  sampling frames and strata`,
  5: `You will develop a sampling system to support the collection of data to meet your overall objective`,
  6: `You will determine your desired sampling size and specify the number of sampling units across all stages`
};

@IonicPage({
  segment: "step-by-step/:stageID",
  defaultHistory: ["HomePage", "StepByStepPage"]
})
@Component({
  selector: "page-stage",
  templateUrl: "stage.html"
})
export class StagePage {
  stage: IStageMeta;
  stages: { [stageId: string]: IStageMeta };
  @ViewChild("navbar")
  navbar: Navbar;
  @ViewChild("content")
  content: Content;
  @ViewChild("stageSlides")
  stageSlides: Slides;
  @select(["activeProject", "values"])
  readonly formValues$: Observable<any>;
  @select(["view", "params", "tabSection"])
  readonly tabSection$: Observable<any>;
  @select(["view", "params", "stagePart"])
  readonly stagePart$: Observable<string>;
  stagePart: string;
  activeSection: string = "main";
  introHtml = INTRO_HTML;
  activeGlossaryTerm: string;
  form: FormGroup = this.formPrvdr.formGroup;
  section: any;
  relevant: string;
  loaded: boolean;
  totalResources: number;
  stageResources: IStageResources;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataPrvdr: DataProvider,
    public formPrvdr: FormProvider,
    public viewCtrl: ViewController,
    public viewActions: ViewActions,
    public customRouter: CustomRouterProvider,
    private resourcesPrvdr: ResourcesProvider,
    // project actions and ngredux required for child components
    public ngRedux: NgRedux<AppState>,
    public projectActions: ProjectActions
  ) {
    // part of workaround for router locked params #114
    this.customRouter.unlockHash();
    this.stageInit(navParams);
    this.getResources(this.stage.number);
    this._subscribeToViewChanges();
  }

  stageInit(navParams) {
    let stageID = navParams.data.stageID;
    this.stages = {
      "stage-1": {
        name: "General objectives",
        title: "General Objectives",
        icon: "assets/img/icons/objectives.svg",
        number: 1
      },
      "stage-2": {
        name: "Indicators",
        title: "Indicators",
        icon: "assets/img/icons/indicators.svg",
        number: 2
      },
      "stage-3": {
        name: "Definition of the target population and units of study",
        title: "Target Population",
        icon: "assets/img/icons/population.svg",
        number: 3
      },
      "stage-4": {
        name: "At what level do you need to report these results",
        title: "Reporting Results",
        icon: "assets/img/icons/reporting.svg",
        number: 4
      },
      "stage-5": {
        name: "Selecting the sampling units",
        title: "Selecting and Reaching Sampling Units",
        icon: "assets/img/icons/outreach.svg",
        number: 5
      },
      "stage-6": {
        name: "Allocating and deploying resources",
        title: "Allocating and deploying resources",
        icon: "assets/img/icons/allocate.svg",
        number: 6
      }
    };
    this.stage = this.stages[stageID];
    this.section = this.stage.name;
    this.viewActions.updateView({ activeStageID: stageID });
  }

  ionViewDidEnter() {
    this.loaded = true;
    this._addBackButtonFunction();
  }

  async getResources(stage: number) {
    const resourcesObs = this.resourcesPrvdr.getStageResources(
      stage
    ) as Observable<IStageResources>;
    resourcesObs.subscribe(res => {
      if (res && res.questions) {
        this.stageResources = res;
        this.totalResources = Object.keys(res.questions).length;
      }
    });
  }

  // handle routing between main/resource/glossary sections using hash query params (changes subscribed to in _subscribeToViewChanges)
  goTo(section: "resources" | "glossary") {
    if (section) {
      this.customRouter.updateHashParams({
        tabSection: section
      });
    } else {
      this.customRouter.removeHashParam("tabSection");
    }
  }

  _subscribeToViewChanges() {
    this.tabSection$.subscribe(
      section => (this.activeSection = section ? section : "main")
    );
    this.stagePart$.subscribe(p => {
      this.stagePart = p;
    });
  }

  // custom intercept for back button to handle going back in sections vs nav pop
  _addBackButtonFunction() {
    // if in main section pop, otherwise go to main
    this.navbar.backButtonClick = () => {
      this.customRouter.unlockHash();
      let section = location.hash.split("tabSection=")[1];
      if (section) {
        window.history.back();
      } else {
        this.navCtrl.pop();
      }
    };
  }
  closeModal() {
    this.dataPrvdr.backgroundSave();
    this.viewCtrl.dismiss();
  }

  pushPage(component, params) {
    this.navCtrl.push(component, params);
  }

  // click handler to move to next part of stage subsection
  nextStep() {
    // unlock nav params if locked (#114)
    this.customRouter.unlockHash();
    // first part (0) undefined so just go part 1
    if (!this.stagePart) {
      this.customRouter.updateHashParams({ stagePart: 1 });
    }
    // otherwise increment part and update
    else {
      try {
        let nextPart = parseInt(this.stagePart) + 1;
        this.customRouter.updateHashParams({ stagePart: nextPart });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
