import { ViewChild, Component } from "@angular/core";
import { IStageMeta, IStageResources, AppState } from "src/app/models/models";
import { IonSlides, Events, IonContent, ModalController } from "@ionic/angular";
import { Subscription, Subject } from "rxjs";
import { FormGroup } from "@angular/forms";
import { DataProvider } from "src/app/services/data/data";
import { DataVisProvider } from "src/app/services/data-vis/data-vis";
import { FormProvider } from "src/app/services/form/form";
import { ViewActions, ProjectActions } from "src/app/actions/actions";
import { ResourcesProvider } from "src/app/services/resources/resources";
import { NgRedux } from "@angular-redux/store";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";

const INTRO_HTML = {
  1: `You will identify the main objectives of the survey you want to carry out. There are <strong>1-3 questions</strong> in 
  this step, which will check if the tool is suitable for your purposes and record information to inform decisions later in 
  the process.`,
  2: `You will specify the indicator that will guide some of your decisions about sampling.`,
  3: `You will identify your target population and consider any additional criteria for exclusion or inclusion to
  make it as well-defined as possible.`,
  4: `You will consider the disaggregation requirements for the data to be collected, to use as a basis for determining
  sampling frames.
  <br><br>
  <span class="disclaimer">Disclaimer - The tool has been simplified since original recording. Please disregard any comments on strata or reporting levels, 
  as these are now referred to as disaggregation.</span>
  `,
  5: `You will develop a sampling system to support the collection of data to meet your overall objective.`,
  6: `You will determine your desired sampling size and specify the number of sampling units across all sampling stages.`
};
const INTRO_VIDEOS = {
  1: "WrItOI2G1cc",
  2: "6BizXOM3_2Y",
  3: "Y37hbzZwHC8",
  4: "iS_aL9lY-i4",
  5: "v9lbkggU9lc",
  6: "8dwF0Zjz1ZY"
};
const STAGES = {
  "1": {
    name: "General objectives",
    title: "General Objectives",
    icon: "assets/img/icons/objectives.svg",
    number: 1
  },
  "2": {
    name: "Indicators",
    title: "Indicators",
    icon: "assets/img/icons/indicators.svg",
    number: 2
  },
  "3": {
    name: "Definition of the target population and units of study",
    title: "Target Population",
    icon: "assets/img/icons/population.svg",
    number: 3
  },
  "4": {
    name: "At what level do you need to report these results",
    title: "Reporting Results",
    icon: "assets/img/icons/reporting.svg",
    number: 4
  },
  "5": {
    name: "Selecting the sampling units",
    title: "Selecting and Reaching Sampling Units",
    icon: "assets/img/icons/outreach.svg",
    number: 5
  },
  "6": {
    name: "Allocating and deploying resources",
    title: "Allocating and deploying resources",
    icon: "assets/img/icons/allocate.svg",
    number: 6
  }
};

@Component({
  selector: "app-stage",
  templateUrl: "stage.page.html",
  styleUrls: ["stage.page.scss"]
})
export class StagePage {
  removeSubscriptions$ = new Subject();
  stage: IStageMeta;
  stages: { [stageId: string]: IStageMeta } = STAGES;
  @ViewChild("navbar", { static: true })
  navbar: any;
  @ViewChild("content", { static: true })
  content: IonContent;
  @ViewChild("stageSlides", { static: true })
  stageSlides: IonSlides;
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
    public route: ActivatedRoute,
    public dataPrvdr: DataProvider,
    public dataVisPrvdr: DataVisProvider,
    public events: Events,
    public formPrvdr: FormProvider,
    public viewActions: ViewActions,
    private resourcesPrvdr: ResourcesProvider,
    // project actions and ngredux required for child components
    public ngRedux: NgRedux<AppState>,
    public projectActions: ProjectActions,
    public router: Router,
    private modalCtrl: ModalController
  ) {
    this.stageInit(this.route.snapshot.params.stageNumber);
    this._addSubscribers();
    this.videoPlayerWidth = Math.min(window.innerWidth - 70, 675);
    this.videoPlayerHeight = Math.round((this.videoPlayerWidth / 16) * 9);
  }

  ngOnDestroy() {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }
  _addSubscribers() {
    this.ngRedux
      .select<string>(["view", "params", "stagePart"])
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(p => (this.stagePart = p));
  }

  stageInit(stageNumber: string) {
    this.stage = this.stages[stageNumber];
    this.section = this.stage.name;
    this.viewActions.updateView({ activeStageID: stageNumber });
    this.getResources(this.stage.number);
  }

  showResourcesList(relevant?: string) {
    this.router.navigate(["resources"], {
      queryParams: { relevant, stageNumber: this.stage.number }
    });
  }

  getResources(stage: number) {
    this.stageResources = this.resourcesPrvdr.getStageResources(stage);
  }

  closeModal() {
    this.dataPrvdr.backgroundSave();
    this.modalCtrl.dismiss();
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
