import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Stage4Component } from '../stage-4';

@Component({
  selector: 'stage-4-define-level-categories',
  templateUrl: 'stage-4-define-level-categories.html'
})
export class Stage4_DefineLevelCategoriesComponent extends Stage4Component {

  strata: any = {}
  strataList: string[]

  ngOnInit() {
    this.preloadStrata()
    this.getListOfStrata(this.form.value['q4.2'])
    this.form.controls['q5.3'].valueChanges.subscribe(v => this.getListOfStrata(v))
  }

  preloadStrata() {
    if (this.form.value.strata != "" && this.form.value.strata != undefined) {
      this.strata = JSON.parse(this.form.value['strata'])
    }
  }

  setStrataNumber(e, strataName) {
    let strataNames = {}
    // push new name entries
    for (let i = 0; i < e.value; i++) {
      if (!this.strata[strataName].names[i]) {
        this.strata[strataName].names.push({ label: '' })
      }
    }
    // remove additional names when decreased
    let l = this.strata[strataName].names.length
    let target = e.value
    let removeCount = l - target
    this.strata[strataName].names.splice(target, l - target)
    this.saveStrata()
  }

  saveStrata() {
    // stringify result and save as 'strata' on formgroup (not using standard question interaction for simplicity)
    if (!this.form.value.strata) { this.form.addControl('strata', new FormControl('')) }
    let patch: any = {}
    patch.strata = JSON.stringify(this.strata)
    this.form.patchValue(patch)
  }

  getListOfStrata(v) {
    // build list of specified strata from all stages
    if (v) {
      let strataList = {}
      for (let strata of v) {
        // let s = s['q5.3.4.2']
        // if (strata && strata != '') {
        strataList[strata] = true
        if (!this.strata[strata]) { this.strata[strata] = { names: [] } }
        // }
      }
      this.strataList = Object.keys(strataList)
      console.log('strata list', this.strataList)
    }

  }

}
