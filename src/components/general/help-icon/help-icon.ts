import { Component, Input } from "@angular/core";
import { Events } from "ionic-angular";

@Component({
  selector: "help-icon",
  template: `
  <div class="help-container" >
    <button ion-button icon-only clear style="color:rgba(0,0,0,0.9); margin:0" (click)="helpClicked()">
    <span>{{text}}</span>
    <ion-icon style="padding:0 8px" ios="ios-help-circle-outline" md="ios-help-circle-outline"></ion-icon>
    </button>
  </div>
`
})
export class HelpIconComponent {
  @Input("relevant")
  relevant: string;

  // optional additional text to display next to button
  @Input("text")
  text: string;

  constructor(public events: Events) {}

  helpClicked() {
    this.events.publish("help:clicked", this.relevant);
  }
}
