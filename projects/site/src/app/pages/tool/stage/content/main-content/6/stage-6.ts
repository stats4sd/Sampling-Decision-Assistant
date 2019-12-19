import { Component } from "@angular/core";
import { StagePage } from "src/app/pages/tool/stage/stage.page";

@Component({
  selector: "stage-6",
  templateUrl: "stage-6.html",
  styleUrls: ["stage-6.scss"]
})
export class Stage6Component extends StagePage {
  selectedNode: any = {};
  initComplete: boolean;

  ngAfterViewInit() {
    if (this.stageSlides) {
      this.stageSlides.lockSwipes(true);
    }
    setTimeout(_ => (this.initComplete = true), 200);
  }
}
