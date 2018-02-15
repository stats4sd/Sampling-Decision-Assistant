// not currently used as all repeat group logic handled by survey-question-group
// but might in future to help make tidier

import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormProvider } from '../../../providers/form/form'

@Component({
  selector: 'survey-repeat-group',
  templateUrl: 'survey-repeat-group.html'
})
export class SurveyRepeatGroupComponent {

  @Input('repeatIndex') repeatIndex:string;
  @Input('repeatID') repeatID:string;
  @Input('questionGroup') questionGroup:string

  formGroup = this.formPrvdr.formGroup
  constructor(private formPrvdr:FormProvider) {  }


}
