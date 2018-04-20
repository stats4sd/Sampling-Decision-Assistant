import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Stage4Component } from '../stage-4';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { reportingLevel } from '../../../../../models/models';

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

  reportingLevels: reportingLevel[] = []

  @select(['view', 'params', 'stagePart']) readonly slideSection$: Observable<string>;
  @select(['activeProject', 'values', 'reportingLevels']) readonly reportingLevels$: Observable<ReportingLevel[]>;

  ngOnInit() {
    // bind to reporting level changes to recalculate classification fields 
    this.reportingLevels$.subscribe(
      l => {
        if(l && l instanceof Array){this.reportingLevels=l}}
    )
  }

  // change the current array of level classification data on change, adding placeholder on increase and removing existing on decrease
  setClassificationsNumber(level: ReportingLevel, levelIndex:number) {
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
      names = names.slice(0,total)
    }
    this.reportingLevels[levelIndex].classifications.names=names
    this.save()
  }

  setClassificationName(levelIndex:number,nameIndex:number,e){
    this.reportingLevels[levelIndex].classifications.names[nameIndex]=e.target.value
    this.save()
  }

  save() {
    let patch: any = {}
    patch.reportingLevels = this.reportingLevels
    this.form.patchValue(patch)
  }
}
