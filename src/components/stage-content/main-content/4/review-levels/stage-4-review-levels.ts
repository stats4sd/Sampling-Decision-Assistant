import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Stage4Component } from '../stage-4';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'stage-4-review-levels',
  templateUrl: 'stage-4-review-levels.html'
})
export class Stage4_ReviewLevelsComponent extends Stage4Component {
  levelCombinations: any[] = []
  reportingLevels: any[] = []

  @select(['view','params','stagePart']) readonly slideSection$: Observable<string>;

  ngOnInit() {
    // bind to slide section to call init every time slide focused. use slice to avoid additional unwanted bindings
    this.slideSection$.subscribe(section=>{
      if(section=='2' && this.form.value && this.form.value.reportingLevels){
        this._init(this.form.value.reportingLevels.slice(0))}
      })
  }
  _init(levels) {
    console.log('level review init')
    if (levels && levels != "") {
      // reshape levels array lists to build combinations (want array of name arrays)
      this.reportingLevels = levels
      console.log('reporting levels',this.reportingLevels)
      let categoryLabels = []
      levels.forEach(level => {
        // manage empty arrays (just push not blank)
        if(level.classifications.names.length==0){level.classifications.names=['']}
        categoryLabels.push(level.classifications.names)
      })
      let categoryLists = []
      categoryLabels.forEach((labelArray, i) => {
        labelArray.forEach(name => {
          if (!categoryLists[i]) { categoryLists[i] = [] }
          categoryLists[i].push(name)
        })
      })
      console.log('category lists',categoryLists)
      this._buildCombinations(categoryLists)
    }

  }
  // recursive function to build all combinations of variables across an array list
  // e.g    [a,b],[1,2,3]  ->  [a,1],[a,2],[a,3],[b,1],[b,2],[b,3],[c,1],[c,2],[c,3] 
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
      if (arrays[0]) {
        combinations = arrays[0].map(el => { return el.split('||') })
        this.levelCombinations = combinations
      }
      console.log('level combinations',this.levelCombinations)

    }
  }
}
