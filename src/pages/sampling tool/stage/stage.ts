import { Component, ViewChild } from "@angular/core";
import {
  Content,
  Events,
  IonicPage,
  Navbar,
  NavController,
  NavParams,
  Slides,
  ViewController
} from "ionic-angular";
import { FormGroup } from "@angular/forms";
import { DataProvider } from "../../../providers/data/data";
import { DataVisProvider } from "../../../providers/data-vis/data-vis";
import { FormProvider } from "../../../providers/form/form";
import { ViewActions, ProjectActions } from "../../../actions/actions";
import { NgRedux } from "@angular-redux/store";
import { Subscription } from "rxjs";
import { ResourcesProvider } from "../../../providers/resources/resources";
import { IStageResources, AppState, IStageMeta } from "../../../models/models";

const INTRO_HTML = {
  1: `You will identify the main objectives of the survey you want to carry out. There are <strong>1-3 questions</strong> in 
  this step, which will check if the tool is suitable for your purposes and record information to inform decisions later in 
  the process.`,
  2: `You will specify the indicator that will guide some of your decisions about sampling.`,
  3: `You will identify your target population and consider any additional criteria for exclusion or inclusion to
  make it as well-defined as possible`,
  4: `You will consider the reporting requirements for the data to be collected, to use as a basis for determining
  sampling frames and strata`,
  5: `You will develop a sampling system to support the collection of data to meet your overall objective`,
  6: `You will determine your desired sampling size and specify the number of sampling units across all sampling stages`
};
const INTRO_VIDEOS = {
  1: "fLZ-Tj3dcLw",
  2: "6BizXOM3_2Y",
  3: "Y37hbzZwHC8",
  4: "iS_aL9lY-i4",
  5: "lDFqz1CH3M0",
  6: "8dwF0Zjz1ZY"
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
  stagePart$: Subscription;
  stagePart: string;
  activeSection: string = "main";
  introHtml = INTRO_HTML;
  introVideos = INTRO_VIDEOS;
  activeGlossaryTerm: string;
  form: FormGroup = this.formPrvdr.formGroup;
  section: any;
  relevant: string;
  loaded: boolean;
  stageResources: IStageResources;
  videoPlayerWidth: number;
  videoPlayerHeight: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataPrvdr: DataProvider,
    public dataVisPrvdr: DataVisProvider,
    public events: Events,
    public formPrvdr: FormProvider,
    public viewCtrl: ViewController,
    public viewActions: ViewActions,
    private resourcesPrvdr: ResourcesProvider,
    // project actions and ngredux required for child components
    public ngRedux: NgRedux<AppState>,
    public projectActions: ProjectActions
  ) {
    this.stageInit(navParams);
    this._addSubscribers();
    this.videoPlayerWidth = Math.min(window.innerWidth - 70, 675);
    this.videoPlayerHeight = Math.round((this.videoPlayerWidth / 16) * 9);
  }
  ngOnDestroy() {
    this.stagePart$.unsubscribe();
  }
  _addSubscribers() {
    this.stagePart$ = this.ngRedux
      .select<string>(["view", "params", "stagePart"])
      .subscribe(p => (this.stagePart = p));
  }
  ionViewWillEnter() {
    this.getResources(this.stage.number);
    // use events to listen for help click and show relevant resources
    this.events.unsubscribe("help:clicked");
    this.events.subscribe("help:clicked", relevant => {
      this.showResourcesList(relevant);
    });
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
    // this._addBackButtonFunction();
  }

  showResourcesList(relevant?: string) {
    this.navCtrl.push("ResourcesPage", {
      stage: this.stage,
      resources: this.stageResources,
      relevant: relevant
    });
  }

  // load resources from provider, take the 'questions' field as measure for total number
  // *** note, will want to change in future if containing additional resource types, e.g. weblinks
  async getResources(stage: number) {
    this.stageResources = await this.resourcesPrvdr.getStageResources(stage);
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
    let part;
    try {
      part = Number(this.ngRedux.getState().view.params.stagePart);
    } catch (error) {
      part = 0;
    }
    part++;
    this.viewActions.updateView({ params: { stagePart: part } });
  }
}
