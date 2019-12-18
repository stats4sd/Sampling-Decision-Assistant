import { Component, Input } from "@angular/core";
import { select } from "@angular-redux/store";
import { Observable, Subject } from "rxjs";
import { ModalController } from "@ionic/angular";
import { FrameBuilderPage } from "src/app/pages/tool/frame-builder/frame-builder.page";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "stage-5-frame-builder-overview",
  templateUrl: "stage-5-frame-builder-overview.html",
  styleUrls: ["stage-5-frame-builder-overview.scss"]
})
export class Stage5_FrameBuilderOverviewComponent {
  removeSubscriptions$ = new Subject();
  @Input("reviewMode")
  reviewMode: boolean;
  @select(["activeProject", "values", "samplingStages"])
  readonly samplingStages$: Observable<any[]>;
  samplingStages: any[] = [];
  constructor(private modalCtrl: ModalController) {}
  ngOnInit() {
    this.samplingStages$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(stages => {
        if (stages) {
          this.samplingStages = stages;
        }
      });
  }
  ngOnDestroy(): void {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }
  async buildStage(stageIndex: number) {
    // get formgroup matching stage name to parentID
    const modal = await this.modalCtrl.create({
      component: FrameBuilderPage,
      componentProps: { stageIndex },
      cssClass: "full-screen"
    });
    await modal.present();
  }
}
