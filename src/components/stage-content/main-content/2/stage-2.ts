import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { StagePage } from '../../../../pages/sampling tool/step-by-step/stage/stage';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'stage-2',
  templateUrl: 'stage-2.html'
})
export class Stage2Component extends StagePage {
  sd:number;
  ngOnInit() {
    // listen for updates on min/max values to automatically calculate s.d
    this.events.subscribe('valueUpdated:q2.2.3',(update)=>this._calculateSD())
    this.events.subscribe('valueUpdated:q2.2.4',(update)=>this._calculateSD())
    this._calculateSD()
  }
  _calculateSD(){
    console.log('calculate sd?')
    if(this.form.value['q2.2.4']!='' && this.form.value['q2.2.3']!=''){
      console.log('calculating sd')
      let sd = (this.form.value['q2.2.4'] - this.form.value['q2.2.3'])/6
      console.log('sd',sd)
      this.sd=sd
      let patch = {}
      patch['q2.2.2'] = sd
      this.form.patchValue(patch)
      console.log('form',this.form)
    }
  }

}
