import { Component } from "@angular/core";
import { IonicPage, ViewController } from "ionic-angular";
import { NgRedux } from "@angular-redux/store";
import {
  AppState,
  ProjectValues,
  StageMeta,
  ReportingLevel,
  IAllocation
} from "../../../models/models";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import * as utils from "../../../utils/download";
import QUESTION_META from "../../../providers/questionMeta";
import { CalculatorVars } from "../../../components/dataVis/sample-size-calculator/sample-size-calculator";

interface IQuestionMeta {
  ["controlName"]?: {
    section: string;
    label: string;
  };
}
interface ISummaryQuestion {
  controlName: string;
  section: string;
  label: string;
  response: string;
}
interface ISectionMeta {
  section: string;
  questions: ISummaryQuestion[];
}
interface ISectionMetaObject {
  ["section"]?: {
    questions: ISummaryQuestion[];
    order: number;
    complete: Boolean;
  };
}
interface ICalcVal {
  label: string;
  value: string | number;
  var?: string;
}

@IonicPage({
  defaultHistory: ["HomePage", "StepByStepPage"]
})
@Component({
  selector: "page-summary",
  templateUrl: "summary.html"
})
export class SummaryPage {
  projectValues$: Subscription;
  projectValues: ProjectValues;
  questionMetaObject: IQuestionMeta = {};
  summaryQuestions: ISummaryQuestion[];
  calcVals: {
    assumptions: ICalcVal[];
    calculated: ICalcVal[];
    outputs: ICalcVal[];
  };
  allocations: ICalcVal[];
  sections: ISectionMeta[];
  samplingStages: StageMeta[];
  reportingLevels: ReportingLevel[];

  constructor(
    private ngRedux: NgRedux<AppState>,
    // keep dataPrvdr import to allow project resume prompt
    private viewCtrl: ViewController
  ) {
    this.addSubscribers();
    this.getQuestionLabels();
  }
  ngOnDestroy(): void {
    this.projectValues$.unsubscribe();
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  init(values: ProjectValues) {
    if (values) {
      console.log("values", values);
      this.projectValues = values;
      const questions: ISummaryQuestion[] = this.getOnlyQuestions(values);
      this.buildSections(questions);
      if (values.samplingStages) {
        this.samplingStages = values.samplingStages;
      }
      if (values.reportingLevels) {
        this.reportingLevels = values.reportingLevels;
      }
      if (values._calculatorVars) {
        this.calcVals = this.buildCalcVals(values._calculatorVars);
        console.log("calc vals", this.calcVals);
      }
      if (values._allocation) {
        this.allocations = this.buildAllocation(values._allocation);
      }
    }
  }

  // take the array of existing variable names and labels used within calculator and popuplate with values
  buildCalcVals(vals: CalculatorVars) {
    return {
      assumptions: vals.exportLabels.assumptions.map(l => {
        l.value = vals.inputs[l.var];
        return l;
      }),
      calculated: vals.exportLabels.calculated.map(l => {
        l.value = vals.inputs[l.var];
        return l;
      }),
      outputs: vals.exportLabels.results.map(l => {
        l.value = vals.outputs.raw[l.var];
        return l;
      })
    };
  }

  buildAllocation(vals: IAllocation) {
    console.log('build allocation',vals)
    return [
      {
        label: "Recommended Minimum Sample Size per Aggregation",
        value: vals.recommendedAggregationSize
      },
      {
        label: "Sample Size per Aggregation",
        value: vals.aggregationSampleSize
      },
      {
        label: "Total Sample Size",
        value: vals.totalSampleSize
      }
    ];
  }

  // group questions by corresponding section and convert to array for rendering
  buildSections(questions: ISummaryQuestion[]) {
    const sections: ISectionMetaObject = {};
    const completed = this.ngRedux.getState().activeProject.stagesComplete;
    questions.forEach(q => {
      if (!sections[q.section]) {
        const index = Object.keys(sections).length + 1;
        sections[q.section] = {
          section: q.section,
          order: index,
          complete: completed[index],
          questions: [q]
        };
      } else {
        sections[q.section].questions.push(q);
      }
    });
    const arr = [];
    Object.keys(sections).forEach(k => arr.push(sections[k]));
    this.sections = this._sortObjectArrayByKey(arr, "order");
    console.log("section meta", this.sections);
  }

  // take master question meta array and reduce to object for quick reference
  getQuestionLabels() {
    const meta = {};
    QUESTION_META.forEach(q => {
      meta[q.controlName] = {
        section: q.section,
        label: q.label
      };
    });
    this.questionMetaObject = meta;
  }

  // filter all project values to retain just those linked to specific question numbers and non-null
  getOnlyQuestions(values: ProjectValues) {
    const questions = [];
    Object.keys(values).forEach(k => {
      if (k.charAt(0) == "q" && values[k]) {
        questions.push({
          controlName: k,
          section: this.questionMetaObject[k].section,
          label: this._stripHtml(this.questionMetaObject[k].label),
          response: values[k]
        });
      }
    });
    return this._sortObjectArrayByKey(questions, "controlName");
  }

  download() {
    const title = this.ngRedux.getState().activeProject.title;
    utils._htmlToDoc("exportSummary", title);
    try {
      this.viewCtrl.dismiss();
    } catch (error) {
      // loaded page directly so back button will exist
    }
  }

  addSubscribers() {
    this.projectValues$ = this.ngRedux
      .select<ProjectValues>(["activeProject", "values"])
      .pipe(debounceTime(250))
      .subscribe(v => this.init(v));
  }

  // strip anything between html tags
  _stripHtml(text: string) {
    return text.replace(/<[^>]*>/g, "");
  }

  _sortObjectArrayByKey(arr: any[], key: string) {
    arr = arr.sort((a, b) => {
      return a[key] > b[key] ? 1 : -1;
    });
    return arr;
  }
}
