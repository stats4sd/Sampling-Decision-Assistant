import { Component, Input } from "@angular/core";
import { Events } from "ionic-angular";

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

  constructor(public events: Events) {}

  helpClicked() {
    this.events.publish("help:clicked", this.relevant);
  }
  /* 

  // Old code using has params to change to show resources. Events simpler now no longer using tabs
  // use hash params to change nav to resources tab and show relevant

  this.customRouter.unlockHash();
    this.customRouter.setHashParams({
      tabSection: "resources",
      relevant: this.relevant
    });
    this.projectActions.setRelevantResources(this.relevant)

  */
}
