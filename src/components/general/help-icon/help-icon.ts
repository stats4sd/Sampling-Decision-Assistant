import { Component, Input } from "@angular/core";
import { Events } from "ionic-angular";
import { ProjectActions, ViewActions } from "../../../actions/actions";
import { CustomRouterProvider } from "../../../providers/router/router";

@Component({
  selector: "help-icon",
  template: `
  <div class="help-container" >
    <button ion-button icon-only clear style="color:rgba(0,0,0,0.9); margin:0" (click)="helpClicked()">
    <ion-icon style="padding:0 8px" ios="ios-help-circle-outline" md="ios-help-circle-outline"></ion-icon>
    </button>
  </div>
`
})
export class HelpIconComponent {
  @Input("relevant")
  relevant: any;

  constructor(
    public events: Events,
    private projectActions: ProjectActions,
    private customRouter: CustomRouterProvider
  ) {}

  // use hash params to change nav to resources tab and show relevant
  helpClicked() {
    this.customRouter.unlockHash();
    this.customRouter.setHashParams({
      tabSection: "resources",
      relevant: this.relevant
    });
    // this.projectActions.setRelevantResources(this.relevant)
  }
}
