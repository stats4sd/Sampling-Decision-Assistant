import { Component } from '@angular/core';
import { Stage5Component } from '../stage-5';

@Component({
  selector: 'stage-5-recap',
  templateUrl: 'stage-5-recap.html'
})
export class Stage5_RecapComponent extends Stage5Component {
  // samplingUnit:string

  infoProvided = [
    { heading: 'Main Objective', image: '', formControl: 'q1.3', stage: 'stage-1' },
    { heading: 'Key Indicator', image: '', formControl: 'q2.1.1', stage: 'stage-2' },
    { heading: 'Sampling Unit', image: '', formControl: 'q3.5', stage: 'stage-3' },
    { heading: 'Reporting Level', image: '', formControl: 'q4.3', stage: 'stage-4' },
  ]

  ngOnInit() {
    // this._patchSection3(this.form.value)
    // this.form.valueChanges.subscribe(v => this._patchSection3(v))
    //this._patchSection3()
    // this.samplingUnit = this._generateSamplingUnit()
  }

  

}
