import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormProvider } from '../../../providers/form/form';
import { FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-sample-size-calculator',
  templateUrl: 'sample-size-calculator.html',
})
export class SampleSizeCalculatorPage {

  calculatorVariables: any[] = []
  form: FormGroup

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private formPrvdr: FormProvider) {
    this.form = this.formPrvdr.formGroup
    this.calculateVariables()
  }

  calculateVariables() {
    let v = {}
    let val = this.form.value

    if (val['q2.1.2'] == "Proportion of elements in the population with the characteristics of the indicator") {
      v["Type of Variable"]="Percentage"
      v["Expected %"] = val['q2.3.1'];
    }
    if (val['q2.1.2'] == "Average or total value of indicator in the population") {
      v["Type of Variable"]="Number"
      v["Standard Deviation"] = val["q2.2.2"]      
    }
    // v["Desired Margin of Error"] = val['q2.4'];
    //v["Desired Confidence Level"]=val[''];
    //v["Clustering Level"]=val[''];
    //v["Number of Samples per PSU"]=val[''];
    v["Number of Sampling Stages"] = val.samplingStages.length;
    //v["Expected Population Size"]=val[''];
    //v["Expected Population Size"]=val[''];

    Object.keys(v).forEach(key => {
      this.calculatorVariables.push({
        name: key,
        val: v[key]
      })
    })

  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

}
