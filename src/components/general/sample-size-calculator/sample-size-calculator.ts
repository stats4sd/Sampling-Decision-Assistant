import { Component } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable'
import { DataProvider } from '../../../providers/data/data';
import { CustomRouterProvider } from '../../../providers/router/router';
declare const jStat

@Component({
    selector: 'sample-size-calculator',
    templateUrl: 'sample-size-calculator.html'
})
export class SampleSizeCalculatorComponent {

    @select(['activeProject', 'values']) projectValues$: Observable<any>

    isCalculating: boolean;
    inputFields: any[] = [
        { title: 'Desired Confidence Level', var: 'conf' },
        { title: 'Clustering Level', var: 'rho' },
        { title: 'Number of Samples per Cluster', var: 'nHH' },
        { title: 'Expected Population Size', var: 'Population' }
    ]
    calculatedFields: any[] = [
        { title: 'Type of Variable', var: 'type' },
        { title: 'Number of Sampling Stages', var: 'stages' },
    ]


    inputValues: CalculatorVars = {
        moe: 5,
        conf: 0.95,
        rho: 0.1,
        nHH: 10,
        Population: 500000,
    }
    outputs: any = {}


    constructor(public dataPrvdr: DataProvider, private customRouter:CustomRouterProvider) {
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
    ngOnInit(){
        this.customRouter.lockHash()
    }

    calculateVariables(v) {
        let projectVals: CalculatorVars = {
            stages: v.samplingStages ? v.samplingStages.length : 0,
        }
        try {
            if (v['q2.1.2'] == "Proportion of elements in the population with the characteristics of the indicator") {
                projectVals.type = "proportion";
                projectVals.prop = v['q2.3.1'];
                // **** need proper way to define moe
                projectVals.moe = 5;
                this.calculatedFields.push(
                    { title: 'Expected %', var: 'prop' },
                    { title: 'Margin of Error (+/- percentage points)', var: 'moe' },
                )
            }
            if (v['q2.1.2'] == "Average or total value of indicator in the population") {
                projectVals.type = "average value";
                projectVals.sd = v["q2.2.2"];
                projectVals.moe = projectVals.sd / 2;
                this.calculatedFields.push(
                    { title: 'Standard Deviation', var: 'sd' },
                    { title: 'Margin of Error (+/-)', var: 'moe' },
                )
            }
        } catch (error) {
            console.error('variable assign error', error)
        }



        this.inputValues = Object.assign({}, this.inputValues, projectVals)

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
        let input:CalculatorVars={}
        Object.keys(this.inputValues).forEach(key=>{
            input[key]=parseFloat(this.inputValues[key])
        })
        input.type=this.inputValues.type
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


        this.outputs = {}
        this.outputs.raw = {
            SRSn: Math.round(SRSn),
            SRSn_FPC: SRSn_FPC,
            DEFF1: Math.round(DEFF1*100)/100,
            FinalstageN: Math.round(FinalstageN),
            FinalstageN_FPC: FinalstageN_FPC,
            stage2N
        }
        this.outputs.rawArray = Object.keys(this.outputs.raw)
        this.outputs.formatted = [
            { var: 'SRSn_FPC', label: "Sample Size Required from Simple Random Sample (1 stage)" },
            { var: 'DEFF1', label: "Design Effect" },
            { var: 'FinalstageN_FPC', label: "Sample Size Required from Clustered Multi-Stage Sample" },
            { var: 'stage2N', label: "Number of Level 2 Clusters Required" },
        ]
    }



}

export interface CalculatorVars {
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