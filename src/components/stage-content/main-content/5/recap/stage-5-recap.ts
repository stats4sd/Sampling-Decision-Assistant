import { Component } from '@angular/core';
import { Stage5Component } from '../stage-5';

@Component({
  selector: 'stage-5-recap',
  templateUrl: 'stage-5-recap.html'
})
export class Stage5_RecapComponent extends Stage5Component {

  infoProvided = [
    { heading: 'Main Objective', image: '', formControl: 'q1.3', stage: 'stage-1' },
    { heading: 'Key Indicator', image: '', formControl: 'q2.1.1', stage: 'stage-2' },
    { heading: 'Sampling Unit', image: '', formControl: 'q3.5', stage: 'stage-3' },
    { heading: 'Reporting Level', image: '', formControl: 'q4.3', stage: 'stage-4' },
  ]

  ngOnInit() {
    this._patchSection3(this.form.value)
    this.form.valueChanges.subscribe(v => this._patchSection3(v))
  }

  _patchSection3(values) {
    let text = this.form.value['q3.1']
    if (this.form.value['q3.2']) {
      text = text + " located in " + this.form.value['q3.2']
    }
    if (this.form.value['q3.3']) {
      text = text + " during " + this.form.value['q3.3']
    }
    if (this.form.value['q3.4']) {
      text = text + " and " + this.form.value['q3.4']
    }
    else { text = "" }
    if (values['q3.5'] != text) {
      let patch = {}
      patch['q3.5'] = text
      this.form.patchValue(patch)
    }

  }

}
