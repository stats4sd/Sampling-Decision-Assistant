import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Stage4Component } from '../stage-4'; 
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'stage-4-review-levels',
  templateUrl: 'stage-4-review-levels.html'
})
export class Stage4_ReviewLevelsComponent extends Stage4Component {
  levelCombinations: any[] = []
  levels: any[] = []
  @select(['activeProject', 'value','reportingLevels']) readonly reportingLevels$: Observable<any[]>;

  ngOnInit() {
    this._init(this.form.value.reportingLevels)
    this.reportingLevels$.subscribe(levels => this._init(levels))
  }
  _init(levels) {
    if (levels && levels != "") {
      // reshape levels array lists to build combinations (want array of name arrays)
      this.levels = levels
      let categoryLabels = []
      levels.forEach(level => { 
        categoryLabels.push(level.classifications.names) 
      })
      let categoryLists = []
      categoryLabels.forEach((labelArray, i) => {
        labelArray.forEach(item => {
          if (!categoryLists[i]) { categoryLists[i] = [] }
          categoryLists[i].push(item)
        })
      })
      this._buildCombinations(categoryLists)
    }

  }
  _buildCombinations(arrays: any[]) {
    let combinations = []
    if (arrays[1]) {
      for (let el of arrays[0]) {
        for (let el2 of arrays[1]) {
          combinations.push(el + '||' + el2)
        }
      }
      arrays[1] = combinations
      arrays.splice(0, 1)
      this._buildCombinations(arrays)
    }
    else {
      // final list
      combinations = arrays[0].map(el => { return el.split('||') })
      this.levelCombinations = combinations
    }
  }
}
