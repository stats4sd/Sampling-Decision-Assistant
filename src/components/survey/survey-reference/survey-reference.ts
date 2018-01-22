import { Component, Input } from '@angular/core';
import { FormProvider } from '../../../providers/form/form'
@Component({
  selector: 'survey-reference',
  templateUrl: 'survey-reference.html'
})
export class SurveyReferenceComponent {
  @Input() set controlName(controlName: string) {
    this._controlName = controlName
  };
  form: any;
  _controlName: string;

  constructor(formPrvdr: FormProvider) {
    this.form = formPrvdr.formGroup
  }
}
