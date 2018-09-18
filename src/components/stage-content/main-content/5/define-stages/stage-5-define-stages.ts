import { Component } from "@angular/core";
import { Stage5Component } from "../stage-5";

@Component({
  selector: "stage-5-define-stages",
  templateUrl: "stage-5-define-stages.html"
})
export class Stage5_DefineStagesComponent extends Stage5Component {
  ngOnInit() {
    // lock params are used to bypass case where url hash loses navparams on action sheet open (when clicking a select question)
    // this is likely to be fixed via router upgrade
    this.customRouter.lockHash();
  }
}
