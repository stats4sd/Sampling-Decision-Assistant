import { Component } from "@angular/core";
import { IonicPage, ViewController } from "ionic-angular";
import { NgRedux } from "@angular-redux/store";
import {
  AppState,
  ProjectValues,
  StageMeta,
  ReportingLevel
} from "../../../models/models";
import { Subscription } from "rxjs";
import { DataProvider } from "../../../providers/data/data";
import { debounceTime } from "rxjs/operators";
import * as utils from "../../../utils/download";
import QUESTION_META from "../../../providers/questionMeta";

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
  sections: ISectionMeta[];
  samplingStages: StageMeta[];
  reportingLevels: ReportingLevel[];

  constructor(
    private ngRedux: NgRedux<AppState>,
    // keep dataPrvdr import to allow project resume prompt
    private dataPrvdr: DataProvider,
    private viewCtrl: ViewController
  ) {
    this._addSubscribers();
    this.getQuestionLabels();
  }
  ngOnDestroy(): void {
    this.projectValues$.unsubscribe();
  }

  _addSubscribers() {
    this.projectValues$ = this.ngRedux
      .select<ProjectValues>(["activeProject", "values"])
      .pipe(debounceTime(250))
      .subscribe(v => this.init(v));
  }

  init(values: ProjectValues) {
    if (values) {
      this.projectValues = values;
      const questions: ISummaryQuestion[] = this.getOnlyQuestions(values);
      this.buildSections(questions);
      if (values.samplingStages) {
        this.samplingStages = values.samplingStages;
        console.log("sampling stages", this.samplingStages);
      }
      if (values.reportingLevels) {
        this.reportingLevels = values.reportingLevels;
        console.log("reporting levels", this.reportingLevels);
      }
    }
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
  // strip anything between html tags
  _stripHtml(text: string) {
    return text.replace(/<[^>]*>/g, "");
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

  _sortObjectArrayByKey(arr: any[], key: string) {
    arr = arr.sort((a, b) => {
      return a[key] > b[key] ? 1 : -1;
    });
    return arr;
  }
}
