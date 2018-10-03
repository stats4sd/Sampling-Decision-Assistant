import { Injectable } from "@angular/core";
import { NgRedux } from "@angular-redux/store";
import { AppState, ReportingLevel } from "../../models/models";

@Injectable()
export class DataVisProvider {
  reportingCombinations: string[];
  reportingLevels: ReportingLevel[];
  constructor(private ngRedux: NgRedux<AppState>) {}

  buildReportingCombinations(levelNames: string[], arrays?) {
    // takes a list of group names and creates a list of all combinations on their category names
    // e.g if group 1 (gender) has male/female, and group 2 (age) has old/young, want 4 combinations
    // [[male,old], [male,young], [female,old], [female,young]]
    let allReportingLevels: ReportingLevel[] = this.ngRedux.getState()
      .activeProject.values.reportingLevels;
    if (!allReportingLevels) {
      allReportingLevels = [];
    }
    if (!arrays) {
      // first step is to simply build a list of all the category names that will be used
      // e.g. [male,female],[old,young]
      // build list of category name arrays
      let arrs = [];
      // reshape groups to correct form array of arrays
      let i = 0;
      allReportingLevels.forEach(level => {
        if (levelNames.indexOf(level.name) > -1) {
          arrs[i] = [];
          level.classifications.names.forEach(name => {
            arrs[i].push(name);
          });
          i++;
        }
      });
      // once complete pass back into function to run again
      return this.buildReportingCombinations(levelNames, arrs);
    }
    // on subsequent passes we combine all combinations of the first 2 arrays, remove the first and repeat until only one set remains
    else {
      let combinations = [];
      if (arrays[1]) {
        for (let el of arrays[0]) {
          for (let el2 of arrays[1]) {
            // combinations.push(el + ' |∩| ' + el2)
            combinations.push(el + ", " + el2);
          }
        }
        arrays[1] = combinations;
        arrays.splice(0, 1);
        return this.buildReportingCombinations(levelNames, arrays);
      } else {
        // final list
        combinations = arrays[0];
        if (!combinations) {
          combinations = [];
        }
        this.reportingCombinations = combinations;
        return combinations;
      }
    }
  }

  // additional method to distinguish between strata and reporting required levels for colouring
  // simply looks up level names and return if any has 'reportingRequired'
  isReportingRequired(levels: string[]) {
    const reportingRequiredLevels: string[] = this.getReportingRequiredLevels();
    let containsRequired = false;
    levels.forEach(level => {
      if (reportingRequiredLevels.indexOf(level) > -1) {
        containsRequired = true;
      }
    });
    return containsRequired;
  }

  // iterate over all reporting levels and return string array of just those marked as reportingRequired
  getReportingRequiredLevels() {
    try {
      const reportingLevels = this.ngRedux
        .getState()
        .activeProject.values.reportingLevels.filter(level => {
          return level.reportingRequired;
        })
        .map(level => {
          return level.name;
        });
      return reportingLevels;
    } catch (error) {
      return [];
    }
  }

  /*
    Alternate code taken from stage 4 - should be merged with above for single concise piece
  */

  getReportingLevels() {
    try {
      const levels: ReportingLevel[] = this.ngRedux
        .getState()
        .activeProject.values.reportingLevels.slice(0);
      if (levels) {
        // reshape levels array lists to build combinations (want array of name arrays)
        // omit levels not marked as reporting requirements (stratification only)
        this.reportingLevels = levels.filter(l => {
          return l.reportingRequired;
        });
        console.log("reporting levels", this.reportingLevels);
        let categoryLabels = [];
        this.reportingLevels.forEach(level => {
          // manage empty arrays (just push not blank)
          if (level.classifications.names.length == 0) {
            level.classifications.names = [""];
          }
          categoryLabels.push(level.classifications.names);
        });
        let categoryLists = [];
        categoryLabels.forEach((labelArray, i) => {
          labelArray.forEach(name => {
            if (!categoryLists[i]) {
              categoryLists[i] = [];
            }
            categoryLists[i].push(name);
          });
        });
        console.log("category lists", categoryLists);
        const levelCombinations = this._buildCombinations(categoryLists);
        console.log("level combinations", levelCombinations);
        return {
          reportingLevels: this.reportingLevels,
          levelCombinations: levelCombinations
        };
      }
    } catch (error) {
      // no reporting levels
      return null;
    }
  }
  // recursive function to build all combinations of variables across an array list
  // e.g    [a,b],[1,2,3]  ->  [a,1],[a,2],[a,3],[b,1],[b,2],[b,3],[c,1],[c,2],[c,3]
  _buildCombinations(arrays: string[][]) {
    let combinations = [];
    if (arrays[1]) {
      for (let el of arrays[0]) {
        for (let el2 of arrays[1]) {
          combinations.push(el + "||" + el2);
        }
      }
      arrays[1] = combinations;
      arrays.splice(0, 1);
      // make sure to return recursive function otherwise end result will be undefined
      return this._buildCombinations(arrays);
    } else {
      // final list
      console.log("final list", arrays);
      combinations = arrays[0].map(el => el.split("||"));
      console.log("final combinations", combinations);
      return combinations;
    }
  }
}
