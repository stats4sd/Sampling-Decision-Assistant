import { Component } from '@angular/core';
import { Stage5Component } from '../stage-5';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'stage-5-frame-builder-overview',
  templateUrl: 'stage-5-frame-builder-overview.html'
})
export class Stage5_FrameBuilderOverviewComponent extends Stage5Component {

  ngOnInit() {
    console.log('locking navigation')
    // lock params are used to bypass case where url hash loses navparams on action sheet open (when clicking a select question)
    // this is likely to be fixed via router upgrade
    this.customRouter.lockHash()
  }
}
