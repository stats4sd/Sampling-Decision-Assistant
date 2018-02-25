import { Component } from '@angular/core';
import { Stage5Component } from '../stage-5';

@Component({
  selector: 'stage-5-define-stages',
  templateUrl: 'stage-5-define-stages.html'
})
export class Stage5_DefineStagesComponent extends Stage5Component {

  ngOnInit() {
    //  push final sampling unit to sampling stages
    console.log('define stages init')
    // if (this.formPrvdr.formGroup.value['q5.2'] == "") {
    //   let patch = {}
    //   patch['q5.2'] = ["_FSU"]
    //   console.log('patching', patch)
    //   this.formPrvdr.formGroup.patchValue(patch)
    //   console.log('value', this.formPrvdr.formGroup.value)
    //   // notify for anything trying to monitor changes to array (e.g. repeat groups)
    //   this.events.publish('arrayChange:q5.2', {
    //     controlName: 'q5.2',
    //     type: 'push',
    //     value: ["_FSU"],
    //     pushValue: "_FSU"
    //   })
    // }
  }

}
