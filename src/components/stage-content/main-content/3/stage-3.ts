import { Component } from '@angular/core';
import { StagePage } from '../../../../pages/sampling tool/step-by-step/stage/stage';

@Component({
  selector: 'stage-3',
  templateUrl: 'stage-3.html'
})
export class Stage3Component extends StagePage {
  verificationBox: boolean

  verify() {
    // build single response of target population definition and patch to q3.5
    console.log('verify', this.verificationBox)
    let text
    if (this.verificationBox) {
      text = this.form.value['q3.1']
      if (this.form.value['q3.2']) {
        text = text + " located in " + this.form.value['q3.2']
      }
      if (this.form.value['q3.3']) {
        text = text + " during " + this.form.value['q3.3']
      }
      if (this.form.value['q3.4']) {
        text = text + " and " + this.form.value['q3.4']
      }
    }
    else { text = "" }
    let patch = {}
    patch['q3.5'] = text
    this.form.patchValue(patch)
    console.log('form', this.form)
  }

}
