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
    this.preloadStrata(this.form.value.strata)
    this.getListOfStrata(this.form.value['q4.2'])
    // change to redux binding to allow for when values don't exist
    this.form.valueChanges.subscribe(v=>{
      if(v && v['q4.2']){this.getListOfStrata(v)}
      if(v[''])
    })
    this.form.controls['strata'].valueChanges.subscribe(s=>this.preloadStrata(s))
  }

  preloadStrata(strata) {
    if (strata != "" && strata != undefined) {
      this.strata = JSON.parse(strata)
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
        strataList[strata] = true
        if (!this.strata[strata]) { this.strata[strata] = { names: [] } }
      }
      console.log('strataList',strataList)
      this.strataList = Object.keys(strataList)
      console.log('strata list', this.strataList)
    }

  }

}
