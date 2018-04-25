import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable'
import { DataProvider } from '../../../providers/data/data';
declare const jStat

@IonicPage({
  segment: 'calculator'
})
@Component({
  selector: 'page-sample-size-calculator',
  templateUrl: 'sample-size-calculator.html',
})
export class SampleSizeCalculatorPage {
  @select(['activeProject', 'values']) projectValues$: Observable<any>

  calculatorVariables: any[] = []
  isCalculating: boolean;
  inputFields: any[] = [
    { title: 'Name of variable', var: 'name' },
    { title: 'Type of Variable', var: 'type' },
    { title: 'Expected %', var: 'prop' },
    { title: 'Standard Deviation', var: 'sd' },
    { title: 'Desired Margin of Error', var: 'moe' },
    { title: 'Desired Confidence Level', var: 'conf' },
    { title: 'Clustering Level', var: 'rho' },
    { title: 'Number of Samples per PSU', var: 'nHH' },
    { title: 'Number of Sampling Stages', var: 'stages' },
    { title: 'Expected Population Size', var: 'Population' }
  ]

  inputValues: calculatorVars = {
    name: ' ',
    type: 'binary',
    moe: 5,
    conf: 0.95,
    rho: 0.1,
    nHH: 10,
    stages: 3,
    Population: 500000,
    poptype: "explicit",
  }
  outputs: any = {}


  constructor(public viewCtrl: ViewController, public dataPrvdr: DataProvider) {
    this.projectValues$.subscribe(v => {
      if (v && !this.isCalculating) {
        this.isCalculating = true
        setTimeout(() => {
          this.calculateVariables(v)
          this.calculateSize()
          this.isCalculating = true
        }, 500);
      }
    })
  }

  calculateVariables(val) {
    let v = {}

    if (val['q2.1.2'] == "Proportion of elements in the population with the characteristics of the indicator") {
      v["Type of Variable"] = "Percentage"
      v["Expected %"] = val['q2.3.1'];
    }
    if (val['q2.1.2'] == "Average or total value of indicator in the population") {
      v["Type of Variable"] = "Number"
      v["Standard Deviation"] = val["q2.2.2"]
    }
    // v["Desired Margin of Error"] = val['q2.4'];
    //v["Desired Confidence Level"]=val[''];
    //v["Clustering Level"]=val[''];
    //v["Number of Samples per PSU"]=val[''];
    if (val.samplingStages) {
      v["Number of Sampling Stages"] = val.samplingStages.length;
    }

    //v["Expected Population Size"]=val[''];
    //v["Expected Population Size"]=val[''];
    let variables = []
    Object.keys(v).forEach(key => {
      variables.push({
        name: key,
        val: v[key]
      })
    })
    this.calculatorVariables = variables

  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  calculateSize() {
    let input: calculatorVars = this.inputValues
    console.log('calculating size', input)

    // percentage/binary
    if (input.type == "binary") {
      input.prop = 50
    }

    // numeric
    if (input.type == "numeric") {
      input.sd = 100
    }

    let SRSn
    let qnorm = function (p) {
      const mean = 0
      const std = 1
      return jStat.normal.inv(p, mean, std)
    }
    // test against r qnorm value from http://seankross.com/notes/dpqr/
    console.log('qnorm test', qnorm(.99))

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

    if(input.type=="numeric"){
      SRSn=(input.sd*qnorm(1-(1-input.conf)/2)/input.moe)**2
      }
    const rho=0.1
    
    if(input.type=="binary"){
      const p1=input.prop/100
      const moe=input.moe/100
      SRSn=(Math.sqrt(p1*(1-p1))*qnorm(1-(1-input.conf)/2)/moe)**2
    }
    const SRSn_FPC=Math.ceil((SRSn*input.Population)/(SRSn+input.Population-1))
    
    const DEFF1=(1+(input.nHH-1)*rho)
    
    const FinalstageN=SRSn*DEFF1
    const FinalstageN_FPC=Math.ceil((FinalstageN*input.Population)/(FinalstageN+input.Population-1))
    
    const stage2N=Math.ceil(FinalstageN_FPC/input.nHH)

    /***********************************************************************************************************/


    this.outputs = {}
    this.outputs.raw = {
      SRSn: Math.round(SRSn),
      SRSn_FPC: SRSn_FPC,
      DEFF1: DEFF1,
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

export interface calculatorVars {

  type: 'numeric' | 'binary', // type of variable (number/percentage error), percentage = binary, number = numeric 

  prob?: number,
  prop?: number   // if binary (%), expected, defaults to prop 50, prob 0.5 
  sd?: number,    // if number, standard deviation, default 100

  moe: number,    // desired margin of error, default 5
  stages: number, // number of sampling stages, default 3
  nHH: number,    // number of samples per PSU
  Population: number, // expected population size
  conf: number,   // desired confidence level, default 0.95
  rho: number,  // clustering value linked to clus select (none:0, low:0.1, moderate:0.25), default low

  // *** not used?
  stagePop?: number[],
  name: string,
  poptype: 'explicit',





}




/*
type="numeric"
var=2
prob=0.5
moe=0.05
stages=3
stagePop<-c(1000,100,10)
conf=0.95
rho=c(0.25,0,0)
nH=10
poptype="explicit"



*/