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
    this.form.controls['q2.2.3'].valueChanges.subscribe(v=>this._calculateSD(v,null))
    this.form.controls['q2.2.4'].valueChanges.subscribe(v=>this._calculateSD(null,v))
    this._calculateSD()
  }
  _calculateSD(lower?,upper?) {
    if(!lower){lower = this.form.value['q2.2.3']}
    if(!upper){upper = this.form.value['q2.2.3']}
    if (lower != '' && upper != '') {
      let sd = (upper - lower) / 6
      // round to 2dp with scaling support (avoid long float numbers)
      sd = Math.round((sd + 0.00001) * 100) / 100
      this.sd = sd
      let patch = {}
      patch['q2.2.2'] = sd
      this.form.patchValue(patch)
    }
  }

}
