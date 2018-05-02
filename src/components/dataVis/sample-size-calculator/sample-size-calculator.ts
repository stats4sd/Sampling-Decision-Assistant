import { Component } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable'
import { DataProvider } from '../../../providers/data/data';
import { CustomRouterProvider } from '../../../providers/router/router';
import { TreeDiagramActions, ProjectActions } from '../../../actions/actions';
import { AppState } from '../../../models/models';
declare const jStat

@Component({
    selector: 'sample-size-calculator',
    templateUrl: 'sample-size-calculator.html'
})
export class SampleSizeCalculatorComponent {
    @select(['activeProject', 'values']) projectValues$: Observable<any>

    isCalculating: boolean;

    inputFields: any[] = []
    inputFieldsDefault: any = {
        conf: { label: 'Desired Confidence Level', var: 'conf' },
        rho: { label: 'Clustering Level', var: 'rho' },
        nHH: { label: 'Number of Samples per Cluster', var: 'nHH' },
        Population: { label: 'Expected Population Size', var: 'Population' },
    }

    calculatedFields: any[] = []
    calculatedFieldsDefault: any = {
        type: { label: 'Type of Variable', var: 'type' },
        stages: { label: 'Number of Sampling Stages', var: 'stages' },
    }

    defaultValues: CalculatorInputVars = {
        moe: 5,
        conf: 0.95,
        rho: 0.1,
        nHH: 10,
        Population: 500000,
    }

    moe: any = {}

    inputValues: CalculatorInputVars = {}

    outputs: CalculatorOutputVars = {}

    constructor(public dataPrvdr: DataProvider, private customRouter: CustomRouterProvider, private ngRedux: NgRedux<AppState>) {
        this.projectValues$.subscribe(v => {
            if (v && !this.isCalculating) {
                this.isCalculating = true
                setTimeout(() => {
                    this.calculateVariables(v)
                    this.calculateSize()
                    this.isCalculating = true
                }, 200);
            }
        })
    }

    ngOnInit() {
        this.customRouter.lockHash()
    }
    resetVariables() {
        this.dataPrvdr.activeProject.values._calculatorVars = null
        this.calculateVariables(this.dataPrvdr.activeProject.values)
    }

    setDefaultFields() {
        this.inputFields = this._jsonToArray(this.inputFieldsDefault)
        this.calculatedFields = this._jsonToArray(this.calculatedFieldsDefault)
    }

    _jsonToArray(json) {
        let arr = []
        Object.keys(json).forEach(k => {
            arr.push(json[k])
        })
        return arr
    }

    // take project values, load any saved input calculator variables and assign calculated variables
    calculateVariables(v) {
        console.log('calculating variables', v)
        let projectVals: CalculatorInputVars = {}
        // set default claculated fields in case type of variable has changed
        this.setDefaultFields()
        // load any presaved values
        if (v._calculatorVars) {
            projectVals = v._calculatorVars.inputs
        }
        // then update from project values
        projectVals.stages = v.samplingStages ? v.samplingStages.length : 0;
        try {
            if (v['q2.1.2'] == "Proportion of elements in the population with the characteristics of the indicator") {
                projectVals.type = "proportion";
                projectVals.prop = v['q2.3.1'];
                if (!projectVals.moe) { projectVals.moe = 5 };
                // set calculated fields array with propotion element
                this.calculatedFields.push({
                    label: 'Expected %', var: 'prop'
                })
                // set moe seperately as is an input but changes depending on calculated
                this.moe = {
                    label: 'Margin of Error (+/- percentage points)',
                    var: 'moe',
                    min: 0.01,
                    max: 25,
                    step: 1
                }
                this.inputFields.push(this.moe)
            }
            if (v['q2.1.2'] == "Average or total value of indicator in the population") {
                projectVals.type = "average value";
                projectVals.sd = v["q2.2.2"];
                if (!projectVals.moe) { projectVals.moe = projectVals.sd / 2 };
                this.calculatedFields.push(
                    { title: 'Standard Deviation', var: 'sd' },
                )
                this.moe = {
                    label: 'Margin of Error (+/-)',
                    var: 'moe',
                    min: 0.01,
                    max: 25,
                    step: 1
                }
                this.inputFields.push(this.moe)
            }
        } catch (error) {
            console.error('variable assign error', error)
        }
        this.inputValues = Object.assign({}, this.defaultValues, projectVals)
        console.log('input fields', this.inputFields)
        console.log('calculated fields', this.calculatedFields)
        console.log('input values', this.inputValues)
    }

    calculateSize() {
        let SRSn
        let qnorm = function (p) {
            const mean = 0
            const std = 1
            return jStat.normal.inv(p, mean, std)
        }
        // known issue with strings: https://github.com/ionic-team/ionic/issues/7121
        // convert all strings to numbers
        let input: CalculatorInputVars = {}
        Object.keys(this.inputValues).forEach(key => {
            input[key] = parseFloat(this.inputValues[key])
        })
        input.type = this.inputValues.type
        console.log('calculating size', input)


        /*********************************************************************************************************** 
         *                              main r code  
         ***********************************************************************************************************/
        // if (input.type == "numeric") {
        //   SRSn = (input.sd * (qnorm(1 - (1 - input.conf) / 2) / input.moe)) ^ 2
        // }

        // if (input.type == "binary") {
        //   const p1 = input.prop / 100
        //   const moe = input.moe / 100
        //   SRSn = (Math.sqrt(p1 * (1 - p1)) * qnorm(1 - (1 - input.conf) / 2) / moe) ^ 2
        // }

        // const SRSn_FPC = Math.ceil((SRSn * input.population) / (SRSn + input.population - 1))
        // const DEFF1 = (1 + (input.nHH - 1) * input.rho)
        // const FinalstageN = SRSn * DEFF1
        // const FinalstageN_FPC = Math.ceil((FinalstageN * input.population) / (FinalstageN + input.population - 1))
        // const stage2N = Math.ceil(FinalstageN_FPC / input.nHH)

        if (input.type == "average value") {
            SRSn = (input.sd * qnorm(1 - (1 - input.conf) / 2) / input.moe) ** 2
        }

        if (input.type == "proportion") {
            const p1 = input.prop / 100
            const moe = input.moe / 100
            SRSn = (Math.sqrt(p1 * (1 - p1)) * qnorm(1 - (1 - input.conf) / 2) / moe) ** 2
        }
        const SRSn_FPC = Math.ceil((SRSn * input.Population) / (SRSn + input.Population - 1))

        const DEFF1 = (1 + (input.nHH - 1) * input.rho)

        const FinalstageN = SRSn * DEFF1
        const FinalstageN_FPC = Math.ceil((FinalstageN * input.Population) / (FinalstageN + input.Population - 1))

        const stage2N = Math.ceil(FinalstageN_FPC / input.nHH)

        /***********************************************************************************************************/


        const raw: CalculatorOutputVarsRaw = {
            SRSn: Math.round(SRSn),
            SRSn_FPC: SRSn_FPC,
            DEFF1: Math.round(DEFF1 * 100) / 100,
            FinalstageN: Math.round(FinalstageN),
            FinalstageN_FPC: FinalstageN_FPC,
            stage2N:stage2N,
            nHH:this.inputValues.nHH
        }
        const rawArray = Object.keys(raw)

        const formatted = this._getFormattedLabels()

        this.outputs = {
            raw: raw,
            rawArray: rawArray,
            formatted: formatted

        }

        // update tree meta state
        this.dataPrvdr.activeProject.values._calculatorVars = {
            inputs: input,
            outputs: this.outputs
        }
        this.dataPrvdr.backgroundSave()
    }

    // depending on single or multi stage, push labels to display with calculator outputs
    _getFormattedLabels() {
        const stages = this.ngRedux.getState().activeProject.values.samplingStages
        const formatted = []
        if (stages) {
            if (stages.length == 1) {
                formatted.push(
                    { var: 'SRSn_FPC', label: "Sample Size Required" },
                )
            }
            if (stages.length > 1) {
                const level2Name=stages[stages.length-2].name
                const level1Name=stages[stages.length-1].name
                formatted.push(
                    { var: 'DEFF1', label: "Design Effect" },
                    { var: 'stage2N', label: "Number of "+level2Name+" required"},
                    { var: 'nHH', label:"Number of "+level1Name+" specified for each reporting level" },
                    { var: 'FinalstageN_FPC', label: "Total sample size for each reporting level" },
                )
            }
        }
        return formatted
    }
}

export interface CalculatorVars {
    inputs: CalculatorInputVars,
    outputs: CalculatorOutputVars
}

export interface CalculatorInputVars {
    type?: 'average value' | 'proportion', // type of variable (number/percentage error), percentage = binary, number = numeric 
    prob?: number,
    prop?: number   // if binary (%), expected, defaults to prop 50, prob 0.5 
    sd?: number,    // if number, standard deviation, default 100
    moe?: number,    // desired margin of error, default 5
    stages?: number, // number of sampling stages, default 3
    nHH?: number,    // number of samples per PSU
    Population?: number, // expected population size
    conf?: number,   // desired confidence level, default 0.95
    rho?: number,  // clustering value linked to clus select (none:0, low:0.1, moderate:0.25), default low
}

export interface CalculatorOutputVarsRaw {
    SRSn: number,
    SRSn_FPC: number,
    DEFF1: number,
    FinalstageN: number,
    FinalstageN_FPC: number,
    stage2N: number,
    nHH:number
}

export interface CalculatorOutputVars {
    raw?: CalculatorOutputVarsRaw,
    rawArray?: any[],
    formatted?: CalculatorOutputVarFormatted[]
}

export interface CalculatorOutputVarFormatted {
    var: string,
    label: string
}