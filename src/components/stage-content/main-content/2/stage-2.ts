import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { StagePage } from '../../../../pages/sampling tool/stage/stage';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
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
    try {
      const values = this.ngRedux.getState().activeProject.values
      if (!lower) { lower = parseFloat(values['q2.2.3']) }
      if (!upper) { upper = parseFloat(values['q2.2.4']) }
      if (lower && upper) {
        let sd = (upper - lower) / 6
        // round to 2dp with scaling support (avoid long float numbers)
        sd = Math.round((sd + 0.00001) * 100) / 100
        this.sd = sd
        if (sd != parseFloat(values['q2.2.2'])) {
          let patch = {}
          // save as string to keep consistent with inputs (even though later converted back to number)
          patch['q2.2.2'] = sd.toString()
          // patch only works if exists so also provide option to add control
          if (!values['q2.2.2']) {
            this.formPrvdr.formGroup.addControl('q2.2.2', this.formPrvdr.fb.control(''))
          }
          this.formPrvdr.formGroup.patchValue(patch)
          this.dataPrvdr.backgroundSave()
        }

      }

    } catch (error) {
      
    }

    // calculate sd, only update form value if different to previous
  }

}
