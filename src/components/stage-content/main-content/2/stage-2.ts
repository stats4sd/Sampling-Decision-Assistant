import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { StagePage } from '../../../../pages/sampling tool/stage/stage';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'stage-2',
  templateUrl: 'stage-2.html'
})
export class Stage2Component extends StagePage {
  sd: number;

  ngOnInit() {
    // listen for updates on min/max values to automatically calculate s.d
    // note subscribing on redux as overrids over subscribers
    this.form.valueChanges.subscribe(v => {
      if (v && v['q2.2.3'] && v['q2.2.4']) { this._calculateSD(v['q2.2.3'], v['q2.2.4'], this.sd) }
    })
    // calculate now also
    try {
      let v = this.ngRedux.getState().activeProject.values
      if (v['q2.2.3'] && v['q2.2.4']) { this._calculateSD(v['q2.2.3'], v['q2.2.4'], this.sd) }
    } catch (error) {

    }




  }
  _calculateSD(lower, upper, current?) {
    // calculate sd, only update form value if different to previous
    console.log('calculating sd')
    if (lower && upper) {
      let sd = (upper - lower) / 6
      // round to 2dp with scaling support (avoid long float numbers)
      sd = Math.round((sd + 0.00001) * 100) / 100
      if (sd != this.sd) {
        this.sd = sd
        let patch = {}
        patch['q2.2.2'] = sd
        this.form.patchValue(patch)
      }

    }
  }

}
