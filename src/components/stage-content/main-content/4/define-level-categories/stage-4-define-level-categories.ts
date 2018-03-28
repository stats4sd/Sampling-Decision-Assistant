import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Stage4Component } from '../stage-4';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'stage-4-define-level-categories',
  templateUrl: 'stage-4-define-level-categories.html'
})
export class Stage4_DefineLevelCategoriesComponent extends Stage4Component {

  // strata: any = {}
  reportingLevels: any[] = []
  classificationsInput: any = {}
  initialInitComplete: boolean = false
  saveMessage:string="save names"
  // use all classifications as temp binding due to input jump

  @select(['activeProject', 'values', 'reportingLevels']) readonly reportingLevels$: Observable<any[]>;

  ngOnInit() {
    this.reportingLevels$.subscribe(
      levels => {
        console.log('levels', levels)
        if (levels instanceof Array) {
          levels.forEach(level => {
            this.classificationsInput[level.name] = level.classifications.names.slice(0)
          })
          this.reportingLevels = levels.slice(0)
        }
      })
  }
  showSaveMessage(){
    this.saveMessage='save names'
  }

  setClassifications(i) {
    console.log('setting classifications', i)
    let total = this.reportingLevels[i].classifications.total
    let names = this.reportingLevels[i].classifications.names
    // add empty on increase
    for (let i = 0; i < total; i++) {
      if (!names[i]) {
        names.push('')
      }
    }
    // remove last on decrease (check lengths)
    let current = names.length
    let target = total
    let removeCount = current - target
    names.splice(target, removeCount)
    console.log('reporting levels', this.reportingLevels)
    this.save()
  }

  updateNames() {
    console.log('updating names', this.classificationsInput)
    let newLevels = []
    newLevels = this.reportingLevels.slice(0)
    console.log('new levels', newLevels)
    newLevels.map(level => {
      level.classifications.names = this.classificationsInput[level.name]
    })
    // this.reportingLevels=newLevels
    let patch: any = {}
    patch.reportingLevels = newLevels
    this.form.patchValue(patch)
    this.saveMessage='saved'

    // this.save()
    // }

  }
  _getIndex(levelName) {
    this.reportingLevels.forEach((level, i) => {
      if (level.name == levelName) { return i }
    })
  }


  // preloadStrata(strata) {
  //   if (strata != "" && strata != undefined) {
  //     this.strata = JSON.parse(strata)
  //   }
  // }

  save() {
    // stringify result and save as 'strata' on formgroup (not using standard question interaction for simplicity)
    // if (!this.form.value.strata) { this.form.addControl('strata', new FormControl('')) }
    let patch: any = {}
    patch.reportingLevels = this.reportingLevels
    this.form.patchValue(patch)
  }
}
