import { Component } from "@angular/core";
import { DecisionToolMenuComponent } from "src/app/components/general/decision-tool-menu/decision-tool-menu";
import {
  PopoverController,
  Events,
  ModalController,
  NavController
} from "@ionic/angular";
import { FormProvider } from "src/app/services/form/form";
import { DataProvider } from "src/app/services/data/data";
import { Project } from "src/app/models/models";
import { Observable } from "rxjs";
import { select } from "@angular-redux/store";

@Component({
  selector: "app-step-by-step",
  templateUrl: "./step-by-step.page.html",
  styleUrls: ["./step-by-step.page.scss"]
})
export class StepByStepPage {
  introVideoYoutubeID = "c6RnCjDnRAI";
  sections: any = [];
  stagesComplete: boolean[] = [];
  activeProject: Project;
  editingMode: boolean;
  @select("activeProject")
  readonly activeProject$: Observable<Project>;

  constructor(
    public navCtrl: NavController,
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
      // this.navCtrl.push("StagePage", { stageID: "stage-" + section.stage });
    }
  }
  enableEditing() {
    this.editingMode = true;
  }
  async showMenu(e) {
    let popover = await this.popoverCtrl.create({
      component: DecisionToolMenuComponent,
      event: e
    });
    await popover.present();
    const dismiss = await popover.onDidDismiss();
    const params = dismiss.data;
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
  }

  startNew() {
    this.dataPrvdr.createNewProject();
  }
  async load() {
    const modal = await this.modalCtrl.create({
      component: "SavedInfoPage",
      cssClass: "full-screen",
      componentProps: { view: "load" }
    });
    await modal.present();
    const dismiss = await modal.onDidDismiss();
    const data = dismiss.data;
    console.log("survey loaded", data);
    if (data) {
      //this.activeProject=this.dataPrvdr.activeProject
    }
  }
  save() {
    this.dataPrvdr.backgroundSave();
    this.editingMode = false;
  }
  pushPage(page) {
    // this.navCtrl.push(page);
  }
}
