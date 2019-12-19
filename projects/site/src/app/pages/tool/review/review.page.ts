import { Component, ViewChildren } from "@angular/core";
import { saveAs } from "file-saver";
import { DataProvider } from "src/app/services/data/data";
import { NgRedux } from "@angular-redux/store";
import {
  AppState,
  StageMeta,
  ReportingLevel,
  ProjectValues
} from "src/app/models/models";
import { LoadingController, ModalController } from "@ionic/angular";
import { CalculatorVars } from "src/app/components/dataVis/sample-size-calculator/sample-size-calculator";
import { SummaryPage } from "../summary/summary.page";

@Component({
  selector: "app-review",
  templateUrl: "./review.page.html",
  styleUrls: ["./review.page.scss"]
})
export class ReviewPage {
  questionGroups: any = [];
  @ViewChildren("survey") surveys;
  canvasImage: any;
  showIntro: boolean = true;
  viewSection: number = 0;
  questionText: any;

  constructor(
    private dataPrvdr: DataProvider,
    private ngRedux: NgRedux<AppState>,
    private loading: LoadingController,
    private modalCtrl: ModalController
  ) {
    // load question meta and seperate out into question groups for binding to survey question components
    this._generateQuestionGroups();
  }

  _generateQuestionGroups() {
    let groups = {};
    this.dataPrvdr.questionMeta.forEach(q => {
      if (!groups[q.section]) {
        groups[q.section] = {
          section: q.section,
          questions: []
        };
      }
      groups[q.section].questions.push(q);
    });
    Object.keys(groups).forEach(k => {
      const val = groups[k];
      this.questionGroups.push(val);
    });
  }

  // canvas exports at current size only, so take a copy, make larger and use for export
  async exportTreeImage() {
    const project = this.ngRedux.getState().activeProject;
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const treeContainer = document.getElementById(
      "treeContainer"
    ) as HTMLElement;
    treeContainer.classList.toggle("export-mode");
    // resize tree canvas for larger export, wait for resize and download
    const loader = await this.loading.create({
      backdropDismiss: false,
      message: "Preparing Export"
    });
    await loader.present();
    await this._wait(2000);
    const dataURL = canvas.toDataURL("image/png");
    let exportFileDefaultName = project.title + ".png";
    this.download(dataURL, exportFileDefaultName);
    treeContainer.classList.toggle("export-mode");
    await loader.dismiss();
  }

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  exportJSON() {
    const project = this.ngRedux.getState().activeProject;
    const dataStr: string = JSON.stringify(project);
    let dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    let exportFileDefaultName = project.title + ".json";
    this.download(dataUri, exportFileDefaultName);
  }

  download(data, filename) {
    saveAs(data, filename);
  }

  async exportDocx() {
    const modal = await this.modalCtrl.create({
      component: SummaryPage,
      cssClass: "full-screen"
    });
    await modal.present();
  }

  /*****************************************************************
          XLSX export functions (could be moved)
  ******************************************************************/
  exportXLSX() {
    const sheets = [];
    const values = this.ngRedux.getState().activeProject.values;
    this.questionText = this._generateQuestionText();
    // seperate core from additional sheets
    const additionalSheets = [
      { title: "stages", controlName: "samplingStages" },
      { title: "calculation", controlName: "_calculatorVars" },
      { title: "allocation", controlName: "allocation" },
      { title: "reporting", controlName: "reportingLevels" }
    ];
    // custom sheets
    additionalSheets.forEach(s => {
      if (values[s.controlName]) {
        sheets.push({
          title: s.title,
          rows: this._generateSheet(s.title, values[s.controlName])
        });
        delete values[s.controlName];
      }
    });
    // main questions sheet
    sheets.push({
      title: "main",
      rows: this._generateMainSheet(values)
    });
    this.dataPrvdr.exportXLSX(sheets);
  }

  _generateQuestionText() {
    let questionText = {};
    this.dataPrvdr.questionMeta.forEach(q => {
      questionText[q.controlName] = q.label;
    });
    return questionText;
  }

  // various methods to generate json array mappings for sheets (which will then be converted so keys match row names)
  _generateSheet(type, values) {
    console.log("generating sheet", type, values);
    let sheet: any[] = [];
    // stage sheets
    if (type == "stages") {
      const stages: StageMeta[] = values;
      stages.forEach(stage => {
        Object.keys(stage).forEach(key => {
          sheet.push({
            q: key,
            text: this.questionText[key],
            response: stage[key]
          });
        });
        sheet.push({ q: null, text: null, response: null });
      });
    }
    // calculation sheets
    if (type == "calculation") {
      const vars: CalculatorVars = values;
      sheet.push({ var: null, val: null, label: "inputs" });
      Object.keys(vars.inputs).forEach(key => {
        sheet.push({ var: key, val: vars.inputs[key], label: null });
      });
      sheet.push({ var: null, val: null, label: "outputs" });
      Object.keys(vars.outputs.raw).forEach(key => {
        sheet.push({ var: key, val: vars.outputs.raw[key], label: null });
      });
    }
    if (type == "allocation") {
      const allocation: any = values;
      Object.keys(allocation).forEach(key => {
        const val: number = values[key];
        sheet.push({ step: key, sampleSize: val });
      });
    }
    if (type == "reporting") {
      const levels: ReportingLevel[] = values;
      levels.forEach(level => {
        sheet.push({
          level: level.name,
          classifications: level.classifications.names.join(",")
        });
      });
    }
    return sheet;
  }

  // iterate over question elements, extract control name for valid questions and save alongside project value
  _generateMainSheet(values: ProjectValues) {
    let qs: any = [];
    const els = document.getElementsByClassName("question-number");
    Array.prototype.forEach.call(els, el => {
      const q = el.getAttribute("controlName");
      qs.push({
        q: q,
        text: this.questionText[q],
        response: values[q]
      });
    });
    return qs;
  }
}
