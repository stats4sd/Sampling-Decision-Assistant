import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Stage4Component } from '../stage-4';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { ReportingLevel } from '../../../../../models/models';

export interface ReportingLevel {
  name: string,
  classifications: LevelClassification
}

export interface LevelClassification {
  names: string[],
  total: string
}

@Component({
  selector: 'stage-4-define-level-categories',
  templateUrl: 'stage-4-define-level-categories.html'
})
export class Stage4_DefineLevelCategoriesComponent extends Stage4Component {

  reportingLevels: ReportingLevel[] = []

  @select(['view', 'params', 'stagePart']) readonly slideSection$: Observable<string>;
  @select(['activeProject', 'values', 'reportingLevels']) readonly reportingLevels$: Observable<ReportingLevel[]>;

  ngOnInit() {
    // bind to reporting level changes to recalculate classification fields 
    this.reportingLevels$.subscribe(
      levels => {
        if (levels instanceof Array) {
          this.reportingLevels = levels
        }
      }
    )
  }

  // change the current array of level classification data on change, adding placeholder on increase and removing existing on decrease
  setClassificationsNumber(level: ReportingLevel, levelIndex: number) {
    const total: number = parseInt(level.classifications.total)
    let names: string[] = level.classifications.names.slice()
    // case number increased - new names to be added
    if (names.length < total) {
      for (let i = names.length; i < total; i++) {
        names.push('')
      }
    }
    // case number decreased - names to be removed
    if (names.length > total) {
      names = names.slice(0, total)
    }
    this.reportingLevels[levelIndex].classifications.names = names
    this.save(this.reportingLevels)
  }

  save(reportingLevels) {
    let patch: any = {}
    patch.reportingLevels = reportingLevels
    this.form.patchValue(patch)
  }

  // only save the name changes when leaving the section to avoid strange update bugs
  ngOnDestroy(){
    this.updateNames()
  }
  // iterate through each name input and update corresponding value on reporting levels
  // note that we haven't used direct binding due to issues with how the values sometimes incorrectly update when
  // navigating between different inputs bound to json sub properties (#130)
  updateNames(){
    this.reportingLevels.forEach((level,i)=>{
      level.classifications.names.forEach((name,j)=>{
        let inputVal = document.getElementById('nameInput-'+i+'-'+j).getElementsByTagName('input')[0].value
        this.reportingLevels[i].classifications.names[j]=inputVal
      })
    })
    this.save(this.reportingLevels)
  }

  
  // setClassificationName(levelIndex: number, nameIndex: number, e) {
  //   let levels = this.reportingLevels.slice()
  //   levels[levelIndex].classifications.names[nameIndex] = e.target.value
  //   this.reportingLevels=levels
  //   let el = document.getElementById('nameInput-0-1').getElementsByTagName('input')[0]
  //   console.log('el',el, 'el.value',el.value)
  //   this.save(this.reportingLevels)
  // }

}
