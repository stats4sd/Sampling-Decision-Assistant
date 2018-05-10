import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SurveyQuestionComponent } from '../../survey-question/survey-question';
import { TextInput } from 'ionic-angular';

// 
@Component({
  selector: 'question-custom-reporting-levels',
  templateUrl: 'question-custom-reporting-levels.html'
})
export class QuestionCustomReportingLevelsComponent extends SurveyQuestionComponent {

  multipleTextInput: any = ""
  multipleTextValues: any = [];
  editMode: boolean
  editValues: string[] = []
  editIndex: number;
  // use meta to split the question across different slides
  @ViewChild('textMultipleInput') textMultipleInput: TextInput;


  /************** custom reporting levels *********************************************************
  similar code and template to multiple text input, but builds objects array instead of string array
  could try find better way to combine/reuse code
  *////////////////////////////////////////////////////////////////////////////////////////////////

  ngOnInit() {
    this._generateMultipleValues()
  }

  _generateMultipleValues() {
    let value = this.formPrvdr.getSurveyValue(this.question.controlName)
    if (value == undefined || value == "" || value == null) {
      value = []
    }
    this.multipleTextValues = value
  }

  saveValue() {
    let patch = {}
    patch[this.question.controlName] = this.multipleTextValues
    this.formPrvdr.formGroup.patchValue(patch)
  }

  addTextMultiple() {
    // push response to array (this is the only functional difference to standard text multiple which only pushes value)
    // 
    let pushValue = {
      name: this.multipleTextInput,
      classifications: {
        total: null,
        names: []
      }
    }
    this.multipleTextValues.unshift(pushValue)
    this.multipleTextInput = "";
    this.saveValue()
  }

  removeTextMultiple(index) {
    let removeValue = this.multipleTextValues[index]
    this.multipleTextValues.splice(index, 1)
    this.saveValue()
    // notify for anything trying to monitor changes to array (e.g. repeat groups)
  }

  enableEdit(i) {
    this.multipleTextInput = this.multipleTextValues[i].name
    this.editMode = true
    this.editIndex = i
    this.textMultipleInput.setFocus()
  }
  saveEdits() {
    if (this.multipleTextValues[this.editIndex]) {
      this.multipleTextValues[this.editIndex].name = this.multipleTextInput
      this.multipleTextInput = ""
      this.editMode = false
      this.editIndex = -1
      this.saveValue()
    }

  }




}
