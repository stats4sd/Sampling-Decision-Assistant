import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'survey-question-group',
  templateUrl: 'survey-question-group.html'
})
export class SurveyQuestionGroupComponent {
  @Input('questions') questions;
  formGroup: FormGroup;
  public payLoad:any;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this._generateQuestionForm()
  }

  _generateQuestionForm() {
    // uses the formbuilder to a form from an array of questions provided
    let questionGroup = {}
    this.questions.forEach(q => {
      // split questions into corresponding sections

      if (!q.value) { questionGroup[q.controlName] = "" }
      else { questionGroup[q.controlName = q.value] }

    });
    // build formgroup sections appropriately
    this.formGroup = this.fb.group(questionGroup)
    console.log('formGroup',this.formGroup)
    this.cdr.detectChanges()
  }

  save() {
    this.payLoad = JSON.stringify(this.formGroup.value);
    console.log('payload',this.payLoad)
  }

}
