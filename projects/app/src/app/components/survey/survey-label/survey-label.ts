import { Component } from "@angular/core";

/**
 * Generated class for the SurveyLabelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "survey-label",
  templateUrl: "survey-label.html",
  styleUrls: ["survey-label.scss"]
})
export class SurveyLabelComponent {
  text: string;

  constructor() {
    console.log("Hello SurveyLabelComponent Component");
    this.text = "Hello World";
  }
}
