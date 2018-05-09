import { Component } from '@angular/core';
import { StagePage } from '../../../../pages/sampling tool/stage/stage';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { select } from '@angular-redux/store'

@Component({
  selector: 'stage-3',
  templateUrl: 'stage-3.html'
})
export class Stage3Component extends StagePage {

  @select(['activeProject', 'values', 'q3.1']) readonly val1$: Observable<string>;
  @select(['activeProject', 'values', 'q3.2']) readonly val2$: Observable<string>;
  @select(['activeProject', 'values', 'q3.3']) readonly val3$: Observable<string>;
  @select(['activeProject', 'values', 'q3.4']) readonly val4$: Observable<string>;

  ngOnInit() {
    this.val1$.subscribe(v => this._generateSamplingUnit())
    this.val2$.subscribe(v => this._generateSamplingUnit())
    this.val3$.subscribe(v => this._generateSamplingUnit())
    this.val4$.subscribe(v => this._generateSamplingUnit())
    // dont want to use form value changes as calls too large a stack. better to use redux for individual
    // this.form.valueChanges.subscribe(v => {
    //   if (v && v['q3.1']){ this._generateSamplingUnit(v) }
    // })

  }

  _generateSamplingUnit() {
    let v = this.form.value
    if (v && v['q3.1']) {
      let text = v['q3.1']
      if (v['q3.2']) {
        text = text + " located in " + v['q3.2']
      }
      if (this.form.value['q3.3']) {
        text = text + " during " + v['q3.3']
      }
      if (this.form.value['q3.4']) {
        text = text + " and " + v['q3.4']
      }
      let patch = {}
      patch['q3.5'] = text

      // patch only works if exists so also provide option to add control
      if (!this.form.value['q3.5']) {
        this.form.addControl('q3.5', new FormControl(text))
      }
      if (this.form.value['q3.5'] != text) {
        console.log('patching sampling unit')
        console.log('form',this.form.value['q3.5'],'text',text)
        this.form.patchValue(patch)
      }
    }

  }

  // _generateSamplingUnit() {
  //   let v = this.form.value
  //   let text = v['q3.1']
  //   if (v['q3.2']) {
  //     text = text + " located in " + v['q3.2']
  //   }
  //   if (this.form.value['q3.3']) {
  //     text = text + " during " + v['q3.3']
  //   }
  //   if (this.form.value['q3.4']) {
  //     text = text + " and " + v['q3.4']
  //   }
  //   if (text != this.form.value['q3.5']) {
  //     let patch = {}
  //     patch['q3.5'] = text
  //     console.log('patching', patch)
  //     // patch only works if exists so also provide option to add control
  //     if (!this.form.value['q3.5']) {
  //       this.form.addControl('q3.5', new FormControl())
  //       this.form.patchValue(patch)
  //       console.log('form', this.form)
  //       this.dataPrvdr.backgroundSave()
  //     }
  //   }
  // }
}
