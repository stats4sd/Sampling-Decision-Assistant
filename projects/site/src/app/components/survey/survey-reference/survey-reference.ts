import { Component, Input } from "@angular/core";
import { FormProvider } from "src/app/services/form/form";
@Component({
  selector: "survey-reference",
  templateUrl: "survey-reference.html",
  styleUrls: ["survey-reference.scss"]
})
export class SurveyReferenceComponent {
  @Input() set controlName(controlName: string) {
    this._controlName = controlName;
  }
  form: any;
  _controlName: string;

  constructor(formPrvdr: FormProvider) {
    this.form = formPrvdr.formGroup;
  }
}
