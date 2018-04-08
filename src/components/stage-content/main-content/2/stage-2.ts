import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { StagePage } from '../../../../pages/sampling tool/stage/stage';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store'


@Component({
  selector: 'stage-2',
  templateUrl: 'stage-2.html'
})
export class Stage2Component extends StagePage {
  @select(['activeProject', 'values', 'q2.2.3']) readonly sdLower$: Observable<number>;
  @select(['activeProject', 'values', 'q2.2.4']) readonly sdUpper$: Observable<number>;

  sd: number;

  ngOnInit() {
    this.sdLower$.subscribe(v => { this._calculateSD() })
    this.sdUpper$.subscribe(v => { this._calculateSD() })
    // listen for updates on min/max values to automatically calculate s.d
    // note subscribing on redux as overrids over subscribers
    // this.form.valueChanges.subscribe(v => {
    //   if (v && v['q2.2.3'] && v['q2.2.4']) { this._calculateSD(v['q2.2.3'], v['q2.2.4'], this.sd) }
    // })
    // calculate now also
    try {
      let v = this.ngRedux.getState().activeProject.values
      if (v['q2.2.3'] && v['q2.2.4']) { this._calculateSD(v['q2.2.3'], v['q2.2.4']) }
    } catch (error) {
    }

  }
  _calculateSD(lower?, upper?) {
    if (!lower) { lower = this.form.value['q2.2.3'] }
    if (!upper) { upper = this.form.value['q2.2.4'] }
    // calculate sd, only update form value if different to previous
    if (lower && upper) {
      console.log('calculating sd')
      let sd = (upper - lower) / 6
      // round to 2dp with scaling support (avoid long float numbers)
      sd = Math.round((sd + 0.00001) * 100) / 100
      if (sd != this.form.value['q2.2.2']) {
        console.log('updating sd')
        this.sd = sd
        let patch = {}
        patch['q2.2.2'] = sd
        // patch only works if exists so also provide option to add control
        if (!this.form.value['q2.2.2']) {
          console.log('adding form control')
          this.form.addControl('q2.2.2', new FormControl())
        }
        console.log('patching', patch)
        this.form.patchValue(patch)
        console.log('form',this.form.value)
      }

    }
  }

}
