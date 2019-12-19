import { Component } from "@angular/core";
import { NgRedux } from "@angular-redux/store";
import * as jStat from "jStat";
import { Subscription, Subject } from "rxjs";
import {
  AppState,
  ReportingLevel,
  StageMeta,
  ProjectValues
} from "../../../models/models";
import { DataProvider, FormProvider, DataVisProvider } from "src/app/services";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "sample-size-calculator",
  templateUrl: "sample-size-calculator.html",
  styleUrls: ["sample-size-calculator.scss"]
})
export class SampleSizeCalculatorComponent {
  removeSubscriptions$ = new Subject();
  inputFields: any[] = [];
  inputFieldsDefault: any = {
    conf: { label: "Desired Confidence Level", var: "conf" },
    rho: { label: "Clustering Level", var: "rho" },
    Population: { label: "Expected Population Size", var: "Population" }
  };

  calculatedFields: any[] = [];
  calculatedFieldsDefault: any = {
    type: { label: "Type of Variable", var: "type" },
    stages: { label: "Number of Sampling Stages", var: "stages" }
  };
  defaultValues: CalculatorInputVars = {
    moe: 5,
    conf: 0.95,
    rho: 0.1,
    nHH: 10,
    Population: 500000
  };
  sampleStages: number;
  sampleStageMeta: StageMeta[];
  moe: any = {};
  inputValues: CalculatorInputVars = {};
  outputs: CalculatorOutputVars = {};
  disaggregationMeta: {
    reportingLevels: ReportingLevel[];
    levelCombinations: string[];
  };
  combinationSampleSize: number;
  totalSampleSize: number;
  showResults: boolean;
  valuesSubscription$: Subscription;

  constructor(
    public dataPrvdr: DataProvider,
    private ngRedux: NgRedux<AppState>,
    private formPrvdr: FormProvider,
    public dataVisPrvdr: DataVisProvider
  ) {}

  ngOnInit() {
    this._waitForProject();
  }
  ngOnDestroy(): void {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }
  init(values: ProjectValues) {
    console.log("init", values);
    this.sampleStageMeta = values.samplingStages;
    this.disaggregationMeta = this.dataVisPrvdr.getReportingLevels();
    this.calculateVariables();
    this.calculateSize();
    this.setFinalStageN();
  }
  resetVariables() {
    this.dataPrvdr.activeProject.values._calculatorVars = null;
    this.calculateVariables();
  }
  toggleShowResults() {
    this.showResults = !this.showResults;
  }
  // listen for values load just once
  _waitForProject() {
    this.valuesSubscription$ = this.ngRedux
      .select(["activeProject", "values"])
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(v => {
        if (v) {
          this.init(v);
          setTimeout(() => {
            this.valuesSubscription$.unsubscribe();
          }, 50);
        }
      });
  }

  setDefaultFields() {
    this.inputFields = this._jsonToArray(this.inputFieldsDefault);
    this.calculatedFields = this._jsonToArray(this.calculatedFieldsDefault);
  }
  // when number of units specified for final stage want to reflect to state as well as applying usual calculations and save
  setFinalStageN() {
    if (this.sampleStageMeta) {
      this.sampleStageMeta[this.sampleStageMeta.length - 1].sampleSize = Number(
        this.inputValues.nHH
      );
      console.log("setting final stage N", this.inputValues.nHH);
      this.formPrvdr.formGroup.patchValue({
        samplingStages: this.sampleStageMeta
      });
      // only calculate if more than 1 stage (otherwise inf loop as final stage n decided from calc)
      if (this.sampleStageMeta.length > 1) {
        this.calculateSize();
      }
    }
  }

  _jsonToArray(json) {
    let arr = [];
    Object.keys(json).forEach(k => {
      arr.push(json[k]);
    });
    return arr;
  }

  // take project values, load any saved input calculator variables and assign calculated variables
  calculateVariables() {
    try {
      const v: ProjectValues = this.ngRedux.getState().activeProject.values;
      let calcVals: CalculatorInputVars = {};
      // set default claculated fields in case type of variable has changed
      this.setDefaultFields();
      // load any presaved values
      if (v._calculatorVars) {
        calcVals = v._calculatorVars.inputs;
      }
      // then update from project values
      calcVals.stages = v.samplingStages ? v.samplingStages.length : 0;
      this.sampleStages = calcVals.stages;
      try {
        if (
          v["q2.1.2"] ==
          "Proportion of elements in the population with the characteristics of the indicator"
        ) {
          calcVals.type = "proportion";
          calcVals.prop = parseFloat(v["q2.3.1"]);
          if (!calcVals.moe) {
            calcVals.moe = 5;
          }
          // set calculated fields array with propotion element
          this.calculatedFields.push({
            label: "Expected %",
            var: "prop"
          });
          // set moe seperately as is an input but changes depending on calculated
          this.moe = {
            label: "Margin of Error (+/- percentage points)",
            var: "moe",
            min: 0.01,
            max: 25,
            step: 1
          };
          this.inputFields.push(this.moe);
        }
        if (
          v["q2.1.2"] == "Average or total value of indicator in the population"
        ) {
          calcVals.type = "average value";
          calcVals.sd = parseFloat(v["q2.2.2"]);
          if (!calcVals.moe) {
            calcVals.moe = calcVals.sd / 2;
          }
          this.calculatedFields.push({
            label: "Standard Deviation",
            var: "sd"
          });
          this.moe = {
            label: "Margin of Error (+/-)",
            var: "moe",
            min: 0.01,
            max: 25,
            step: 1
          };
          this.inputFields.push(this.moe);
        }
      } catch (error) {}
      this.inputValues = Object.assign({}, this.defaultValues, calcVals);
    } catch (error) {}
  }
  calculateSize() {
    let SRSn;
    let qnorm = function(p) {
      const mean = 0;
      const std = 1;
      return jStat.normal.inv(p, mean, std);
    };
    // known issue with strings: https://github.com/ionic-team/ionic/issues/7121
    // convert all strings to numbers
    let input: CalculatorInputVars = {};
    Object.keys(this.inputValues).forEach(key => {
      input[key] = parseFloat(this.inputValues[key]);
    });
    input.type = this.inputValues.type;

    /***********************************************************************************************************
     *                              main r code
     ***********************************************************************************************************/
    let SRSn_FPC;
    let DEFF1;
    let FinalstageN;
    let FinalstageN_FPC;
    let stage2N;
    let p1;
    let moe;
    try {
      if (input.type == "average value") {
        SRSn = ((input.sd * qnorm(1 - (1 - input.conf) / 2)) / input.moe) ** 2;
      }
      if (input.type == "proportion") {
        p1 = input.prop / 100;
        moe = input.moe / 100;
        SRSn =
          ((Math.sqrt(p1 * (1 - p1)) * qnorm(1 - (1 - input.conf) / 2)) /
            moe) **
          2;
      }
      SRSn_FPC = Math.ceil(
        (SRSn * input.Population) / (SRSn + input.Population - 1)
      );
      if (this.sampleStages == 1) {
        FinalstageN = SRSn;
        FinalstageN_FPC = SRSn_FPC;
      }
      if (this.sampleStages > 1) {
        DEFF1 = 1 + (input.nHH - 1) * input.rho;
        FinalstageN = SRSn * DEFF1;
        FinalstageN_FPC = Math.ceil(
          (FinalstageN * input.Population) /
            (FinalstageN + input.Population - 1)
        );
        stage2N = Math.ceil(FinalstageN_FPC / input.nHH);
      }
    } catch (error) {
      console.error(error);
      // throw new error("calculation error");
    }

    /***********************************************************************************************************/

    // if single stage final stageN should be same as nHH so want to update
    // both variable and stage allocation
    if (this.sampleStages == 1) {
      this.inputValues.nHH = FinalstageN_FPC;
      this.setFinalStageN();
    }

    const raw: CalculatorOutputVarsRaw = {
      SRSn: Math.round(SRSn),
      SRSn_FPC: SRSn_FPC,
      DEFF1: DEFF1 ? Math.round(DEFF1 * 100) / 100 : "NA",
      FinalstageN: Math.round(FinalstageN),
      FinalstageN_FPC: FinalstageN_FPC,
      stage2N: stage2N ? stage2N : "NA",
      nHH: this.inputValues.nHH
    };
    const rawArray = Object.keys(raw);

    const formatted = this._getFormattedLabels();

    this.outputs = {
      raw: raw,
      rawArray: rawArray,
      formatted: formatted
    };
    this.calculateTotalSampleSize();
    const recommendations: CalculatorRecommendations = {
      disaggregationMeta: this.disaggregationMeta,
      countFinalStage: this.outputs.raw.nHH,
      countPenultimateStage: this.outputs.raw.stage2N,
      requiredPerAggregation: this.outputs.raw.FinalstageN,
      totalSampleSize: this.totalSampleSize
    };
    let vars = {
      inputs: input,
      outputs: this.outputs,
      recommendations: recommendations,
      // labels for use in word export
      exportLabels: {
        assumptions: this.inputFields,
        calculated: this.calculatedFields,
        results: this.outputs.formatted
      }
    };
    // update tree meta state
    this.dataPrvdr.activeProject.values._calculatorVars = vars;
    this._updateFormCalcVars(vars);
  }

  calculateTotalSampleSize() {
    console.log(
      "calculate total sample size",
      this.disaggregationMeta,
      this.sampleStageMeta
    );
    // attempt to fetch disaggregation meta from data vis provider (returns null if no Disaggregation)
    if (!this.disaggregationMeta) {
      this.disaggregationMeta = this.dataVisPrvdr.getReportingLevels();
    }
    const totalDisaggregations = this.disaggregationMeta
      ? this.disaggregationMeta.levelCombinations.length
      : 1;
    // for multi stage multiply combinations * nHH * stage2N
    if (
      this.sampleStageMeta &&
      this.sampleStageMeta.length > 1 &&
      typeof this.outputs.raw.stage2N == "number"
    ) {
      if (!this.disaggregationMeta) {
      }
      this.totalSampleSize =
        this.outputs.raw.FinalstageN_FPC * totalDisaggregations;
    }
    // for single stage simply return finalStageN * disaggregation combinations
    else {
      this.totalSampleSize =
        this.outputs.raw.FinalstageN_FPC * totalDisaggregations;
    }
  }

  _updateFormCalcVars(vars) {
    if (!this.formPrvdr.formGroup.controls._calculatorVars) {
      this.formPrvdr.formGroup.addControl(
        "_calculatorVars",
        this.formPrvdr.fb.control(vars)
      );
    } else {
      this.formPrvdr.formGroup.patchValue({ _calculatorVars: vars });
      this.dataPrvdr.backgroundSave();
    }
  }

  // depending on single or multi stage, push labels to display with calculator outputs
  _getFormattedLabels() {
    const stages = this.ngRedux.getState().activeProject.values.samplingStages;
    const formatted = [];
    if (stages) {
      if (stages.length == 1) {
        formatted.push({ var: "SRSn_FPC", label: "Sample Size Required" });
      }
      if (stages.length > 1) {
        console.log("stages", stages);
        const level2Name = stages[stages.length - 2].name;
        const level1Name = stages[stages.length - 1].name;
        formatted.push(
          { var: "DEFF1", label: "Design Effect" },
          {
            var: "stage2N",
            label: "Total " + level2Name + " per disaggregation"
          },
          { var: "nHH", label: "Total " + level1Name + " per disaggregation" },
          {
            var: "FinalstageN_FPC",
            label: "Total sample size per disaggregation"
          }
        );
      }
    }
    return formatted;
  }
}

export interface CalculatorVars {
  inputs: CalculatorInputVars;
  outputs: CalculatorOutputVars;
  recommendations: CalculatorRecommendations;
  exportLabels?: any;
}

export interface CalculatorInputVars {
  type?: "average value" | "proportion"; // type of variable (number/percentage error), percentage = binary, number = numeric
  prob?: number;
  prop?: number; // if binary (%), expected, defaults to prop 50, prob 0.5
  sd?: number; // if number, standard deviation, default 100
  moe?: number; // desired margin of error, default 5
  stages?: number; // number of sampling stages, default 3
  nHH?: number; // number of samples per PSU
  Population?: number; // expected population size
  conf?: number; // desired confidence level, default 0.95
  rho?: number; // clustering value linked to clus select (none:0, low:0.1, moderate:0.25), default low
}

export interface CalculatorOutputVarsRaw {
  SRSn?: number;
  SRSn_FPC?: number;
  DEFF1?: number | "NA";
  FinalstageN?: number;
  FinalstageN_FPC?: number;
  stage2N?: number | "NA";
  nHH?: number;
}

export interface CalculatorRecommendations {
  disaggregationMeta: any;
  countFinalStage: number;
  countPenultimateStage: number | "NA";
  totalSampleSize: number;
  requiredPerAggregation: number;
}

export interface CalculatorOutputVars {
  raw?: CalculatorOutputVarsRaw;
  rawArray?: any[];
  formatted?: CalculatorOutputVarFormatted[];
}

export interface CalculatorOutputVarFormatted {
  var: string;
  label: string;
}
