import { Component, Input } from "@angular/core";
import { ResourcesProvider } from "../../../providers/resources/resources";
import { IStageResources } from "../../../models/models";
import { Observable } from "rxjs";
import { ModalController } from "ionic-angular";
import { ResourcesComponent } from "../../general/resources/resources";

@Component({
  selector: "stage-intro",
  templateUrl: "stage-intro.html"
})
export class StageIntroComponent {
  @Input("stage")
  stage: number;
  totalResources: number;
  stageResources: IStageResources;

  constructor(
    private resourcesPrvdr: ResourcesProvider,
    public modal: ModalController
  ) {}

  ngOnInit() {
    this.getResources(this.stage);
  }

  async getResources(stage: number) {
    const resourcesObs = this.resourcesPrvdr.getStageResources(
      stage
    ) as Observable<IStageResources>;
    resourcesObs.subscribe(res => {
      if (res && res.questions) {
        this.stageResources = res;
        this.totalResources = Object.keys(res.questions).length;
      }
    });
  }

  showResourcesList() {
    console.log("showing additional resources");
    this.modal.create(ResourcesComponent).present();
  }
}
