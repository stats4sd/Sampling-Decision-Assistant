import { Component, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "help-icon",
  template: `
    <div class="help-container">
      <ion-button
        fill="clear"
        style="color:rgba(0,0,0,0.9); margin:0; max-width:100%"
        (click)="helpClicked()"
      >
        <span style="max-width:80%; white-space:initial">{{ text }}</span>
        <ion-icon
          slot="icon-only"
          style="padding:0 8px"
          ios="ios-help-circle-outline"
          md="ios-help-circle-outline"
        ></ion-icon>
      </ion-button>
    </div>
  `
})
export class HelpIconComponent {
  @Input("relevant")
  relevant: string;

  // optional additional text to display next to button
  @Input("text")
  text: string;

  constructor(private router: Router, private route: ActivatedRoute) {}

  helpClicked() {
    const stageNumber = this.route.snapshot.params.stageNumber;
    this.router.navigate(["resources"], {
      queryParams: { relevant: this.relevant, stageNumber }
    });
  }
}
