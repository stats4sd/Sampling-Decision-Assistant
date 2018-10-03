import { Component } from "@angular/core";
import { IonicPage, NavParams, Events } from "ionic-angular";
import { IStageMeta, IStageResources } from "../../models/models";

@IonicPage({
  defaultHistory: ["StepByStepPage"]
})
@Component({
  selector: "page-resources",
  templateUrl: "resources.html"
})
export class ResourcesPage {
  stage: IStageMeta;
  resources: IStageResources;
  relevant: string;
  constructor(public navParams: NavParams) {
    this.stage = navParams.data.stage;
    this.resources = navParams.data.resources;
    this.relevant = navParams.data.relevant;
    console.log("resources contructor", navParams.data);
  }

  // whilst in modal clicking help icon will still push the resources page which will by default
  // appear behind the current view; need to change this display to 'none' to view and bring back when closed
  // can use init/destroy to check for such modals and hide appropriately
  ngOnInit() {
    const modalEl = document.querySelector("ion-modal");
    if (modalEl) {
      modalEl.classList.add("no-display");
    }
  }

  ngOnDestroy() {
    const modalEl = document.querySelector("ion-modal");
    if (modalEl) {
      try {
        modalEl.classList.remove("no-display");
      } catch (error) {}
    }
  }

  /*
    Currently this just passes resources from navParams into resource list
    In future may want to link to resources provider to also alternate between different resource
    types and sections
  */
}
