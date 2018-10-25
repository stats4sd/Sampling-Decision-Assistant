import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events,
  PopoverController
} from "ionic-angular";
import { DataProvider } from "../../../providers/data/data";
import { FormProvider } from "../../../providers/form/form";
import { DecisionToolMenuComponent } from "../../../components/general/decision-tool-menu/decision-tool-menu";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { Project } from "../../../models/models";

@IonicPage({
  defaultHistory: ["HomePage"]
})
@Component({
  selector: "page-step-by-step",
  templateUrl: "step-by-step.html"
})
export class StepByStepPage {
  introVideoYoutubeID = "ScMzIvxBSi4";
  sections: any = [];
  stagesComplete: boolean[] = [];
  activeProject: Project;
  editingMode: boolean;
  @select("activeProject")
  readonly activeProject$: Observable<Project>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataPrvdr: DataProvider,
    public modalCtrl: ModalController,
    public events: Events,
    public formPrvdr: FormProvider,
    public popoverCtrl: PopoverController
  ) {
    this.sections = [
      // add class:disabled to disable a button
      {
        name: "General objectives",
        icon: "assets/img/icons/objectives.svg",
        stage: 1
      },
      { name: "Indicators", icon: "assets/img/icons/indicators.svg", stage: 2 },
      {
        name: "Definition of the target population and units of study",
        icon: "assets/img/icons/population.svg",
        stage: 3
      },
      {
        name: "At what level do you need to report these results",
        icon: "assets/img/icons/reporting.svg",
        stage: 4
      },
      {
        name: "Selecting the sampling units",
        icon: "assets/img/icons/outreach.svg",
        stage: 5
      },
      {
        name: "Allocating and deploying resources",
        icon: "assets/img/icons/allocate.svg",
        stage: 6
      }
    ];
    //       { name: "Allocating and deploying resources", icon: "assets/img/icons/allocate.svg", stage: 6, class:"disabled" },
    this.activeProject$.subscribe(p => {
      if (p) {
        this.activeProject = p;
        this.stagesComplete = this.activeProject.stagesComplete;
      }
    });
  }

  goToSection(section) {
    if (section.class != "disabled") {
      this.navCtrl.push("StagePage", { stageID: "stage-" + section.stage });
    }
  }
  enableEditing() {
    this.editingMode = true;
  }
  showMenu(e) {
    let popover = this.popoverCtrl.create(DecisionToolMenuComponent);
    popover.onDidDismiss(params => {
      if (params == "save") {
        if (!this.dataPrvdr.activeProject) {
          this.startNew();
        } else {
          this.save();
        }
      }
      if (params == "load") {
        this.load();
      }
      if (params == "new") {
        this.startNew();
      }
    });
    popover.present({
      ev: e
    });
  }
  showIntroVideo() {}
  startNew() {
    this.dataPrvdr.createNewProject();
  }
  load() {
    let modal = this.modalCtrl.create(
      "SavedInfoPage",
      { view: "load" },
      { cssClass: "full-screen" }
    );
    modal.onDidDismiss(data => {
      console.log("survey loaded", data);
      if (data) {
        //this.activeProject=this.dataPrvdr.activeProject
      }
    });
    modal.present();
  }
  save() {
    this.dataPrvdr.backgroundSave();
    this.editingMode = false;
  }
  pushPage(page) {
    this.navCtrl.push(page);
  }
}
