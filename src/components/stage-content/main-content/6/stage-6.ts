import { Component } from "@angular/core";
import { StagePage } from "../../../../pages/sampling tool/stage/stage";

@Component({
  selector: "stage-6",
  templateUrl: "stage-6.html"
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
  goBack() {
    this.navCtrl.pop();
  }

  nextStage() {
    this.navCtrl.pop();
  }
}
