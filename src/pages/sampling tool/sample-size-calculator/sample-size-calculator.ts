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

  calculatorVariables:any[]=[]
  form:FormGroup

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, private formPrvdr:FormProvider) {
    this.form=this.formPrvdr.formGroup
    this.calculateVariables()
  }

  calculateVariables(){
    let v ={}
    let val = this.form.value
    v["Type of Variable"]=val['q2.1.2'].indexOf("average")>-1 ? "Number" : "Percentage";
    v["Standard Deviation"] = val["q2.3.1"]
    //v["Expected %"]=val[''];
    //v["Desired Margin of Error"]=val[''];
    //v["Desired Confidence Level"]=val[''];
    //v["Clustering Level"]=val[''];
    //v["Number of Samples per PSU"]=val[''];
    v["Number of Sampling Stages"]=val['q5.2'].length;
    //v["Expected Population Size"]=val[''];

    Object.keys(v).forEach(key=>{
      this.calculatorVariables.push({
        name:key,
        val:v[key]
      })
    })

  }

  dismiss(){
    this.viewCtrl.dismiss()
  }

}
