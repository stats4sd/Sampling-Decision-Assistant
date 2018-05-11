import { Component } from '@angular/core';
import { StagePage } from '../../../../pages/sampling tool/stage/stage';
import { select } from '@angular-redux/store';
import { ProjectValues } from '../../../../models/models';

@Component({
  selector: 'stage-4',
  templateUrl: 'stage-4.html'
})
export class Stage4Component extends StagePage {

  ngOnInit(){
    try {
      const v:ProjectValues = this.ngRedux.getState().activeProject.values
      if(v && v["q4.1"]=='One estimate'){
        this.setSingleEstimate(v)
      }
    } catch (error) {
      console.log('error',error)
    }
    
    
  }

  // case where user has specified one estimate, want to automatically populate with indicator but still provide option to change
  setSingleEstimate(v:ProjectValues){
    console.log('setting single estimate')
    if(v['q2.1.1']){
      if(!v['q4.3']||v['q4.3']==""){
          let patch:ProjectValues={}
          patch["q4.3"]=v["q2.1.1"]
          this.formPrvdr.formGroup.patchValue(patch)
          console.log('formgroup',this.formPrvdr.formGroup)
      }
    }
  }

}
