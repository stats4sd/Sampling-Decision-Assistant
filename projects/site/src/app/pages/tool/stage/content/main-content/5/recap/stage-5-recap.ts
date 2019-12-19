import { Component } from "@angular/core";
import { Stage5Component } from "../stage-5";

@Component({
  selector: "stage-5-recap",
  templateUrl: "stage-5-recap.html",
  styleUrls: ["stage-5-recap.scss", "../stage-5.scss"]
})
export class Stage5_RecapComponent extends Stage5Component {
  infoProvided = [
    { heading: "Main Objective", stage: "stage-1" },
    { heading: "Key Indicator", stage: "stage-2" },
    { heading: "Sampling Unit", stage: "stage-3" },
    { heading: "Disaggregation", stage: "stage-4" }
  ];

  ngOnInit() {}
}
