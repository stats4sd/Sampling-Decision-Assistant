import { Component, Input } from '@angular/core';
import { Stage5Component } from '../stage-5';
import { FormArray } from '@angular/forms';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs'
import { CustomRouterProvider } from '../../../../../providers/router/router';
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'stage-5-frame-builder-overview',
  templateUrl: 'stage-5-frame-builder-overview.html'
})
export class Stage5_FrameBuilderOverviewComponent {
  @Input('reviewMode') reviewMode: boolean;
  @select(['activeProject', 'values', 'samplingStages']) readonly samplingStages$: Observable<any[]>
  samplingStages: any[] = []
  constructor(private customRouter: CustomRouterProvider, private modalCtrl: ModalController) {

  }
  ngOnInit() {
    // lock params are used to bypass case where url hash loses navparams on action sheet open (when clicking a select question)
    // this is likely to be fixed via router upgrade
    this.customRouter.lockHash()
    this.samplingStages$.subscribe(stages => {
      if (stages) { this.samplingStages = stages }
    })
  }
  buildStage(stage, stageIndex) {
    // get formgroup matching stage name to parentID
    let params = { stageFormGroup: stage, stageIndex: stageIndex }
    const modal = this.modalCtrl.create({
    })

    this.modalCtrl.create('FrameBuilderPage', params).present()
  }
}
