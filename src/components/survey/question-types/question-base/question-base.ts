import { Component, Input, EventEmitter } from '@angular/core';
import { FormProvider } from '../../../../providers/form/form';
import { Events } from 'ionic-angular';
import { FormGroup } from '@angular/forms';

/**
base to handle question form interactions and common logic
currently mostly duplicate of survey-question component, in future will modularize survey-question 
to act the same as question-base
 */
@Component({
  selector: 'question-base',
  templateUrl: 'question-base.html'
})
export class QuestionBaseComponent {

  @Input() set question(question: any) {
    // when question set automatically try to load value
    this._question = question
    this.preloadValue()
  };
  @Input() set formGroup(formGroup: FormGroup) {
    this._formGroup = formGroup
    this.preloadValue()
  }

  public value: any
  public _question: any;
  private _formGroup: FormGroup

  constructor(public formPrvdr: FormProvider) {
  }
  preloadValue() {
    // get value for specific current formgroup (includes repeat sub-formgroups)
    if (this._question && this._formGroup) {
      this.value = this._formGroup.value[this._question.controlName]
    }
  }

  getValue(controlName) {
    // get specific value from master formgroup
    return this.formPrvdr.formGroup.value[controlName]
  }

  setValue(value) {
    // patch value to parent component
    let patch = {}
    patch[this._question.controlName] = value
    this._formGroup.patchValue(patch)
    console.log('formGroup', this.formPrvdr.formGroup.value)
  }


}
