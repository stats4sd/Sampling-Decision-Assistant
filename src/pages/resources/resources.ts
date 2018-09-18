import { Component } from "@angular/core";
import { IonicPage, NavParams } from "ionic-angular";
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
  }
  /*
    Currently this just passes resources from navParams into resource list
    In future may want to link to resources provider to also alternate between different resource
    types and sections
  */
}
