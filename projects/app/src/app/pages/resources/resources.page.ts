import { Component, OnInit } from "@angular/core";
import { IStageMeta } from "src/app/models/models";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-resources",
  templateUrl: "./resources.page.html",
  styleUrls: ["./resources.page.scss"]
})
export class ResourcesPage implements OnInit {
  stageNumber: IStageMeta;
  relevant: string;
  constructor(route: ActivatedRoute) {
    const params = route.snapshot.queryParams;
    this.stageNumber = params.stageNumber;
    this.relevant = params.relevant;
    console.log("params", params);
    console.log("stage number", this.stageNumber);
    console.log("relevant", this.relevant);
  }

  // whilst in modal clicking help icon will still push the resources page which will by default
  // appear behind the current view; need to change this display to 'none' to view and bring back when closed
  // can use init/destroy to check for such modals and hide appropriately
  ngOnInit() {
    const modalEl = document.querySelector("ion-modal");
    if (modalEl) {
      modalEl.classList.add("no-display");
    }
  }

  ngOnDestroy() {
    const modalEl = document.querySelector("ion-modal");
    if (modalEl) {
      try {
        modalEl.classList.remove("no-display");
      } catch (error) {}
    }
  }

  /*
    Currently this just passes resources from navParams into resource list
    In future may want to link to resources provider to also alternate between different resource
    types and sections
  */
}
