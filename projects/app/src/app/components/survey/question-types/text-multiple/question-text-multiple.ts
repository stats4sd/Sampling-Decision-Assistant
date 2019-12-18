import { Component, ViewChild } from "@angular/core";
import { SurveyQuestionComponent } from "../../survey-question/survey-question";

@Component({
  selector: "question-text-multiple",
  templateUrl: "question-text-multiple.html",
  styleUrls: ["question-text-multiple.scss"]
})
export class QuestionTextMultipleComponent extends SurveyQuestionComponent {
  multipleTextInput: any = "";
  multipleTextValues: any = [];
  editMode: boolean;
  editValues: string[] = [];
  editIndex: number;
  @ViewChild("textMultipleInput", { static: true })
  textMultipleInput: any;

  ngOnInit() {
    console.log("question text multiple init", this.question);
    this._generateMultipleValues();
  } //////////////////////////////////////////////////////////////////////////

  /************** text multiple*********************************************
    This custom component allows for input into multiple text fields
    It handles binding through direct form control setting (instead of value accessors)
    */ _generateMultipleValues() {
    let value = this.formPrvdr.getSurveyValue(this.question.controlName);
    if (value == undefined || value == "" || value == null) {
      value = [];
    }
    this.multipleTextValues = value;
  }

  saveValue() {
    let patch = {};
    patch[this.question.controlName] = this.multipleTextValues;
    this.formPrvdr.formGroup.patchValue(patch);
  }

  addTextMultiple() {
    // push response to array
    let pushValue = this.multipleTextInput;
    this.multipleTextValues.unshift(this.multipleTextInput);
    this.multipleTextInput = "";
    this.saveValue();
    // notify for anything trying to monitor changes to array (e.g. repeat groups)
    this.events.publish("arrayChange:" + this.question.controlName, {
      controlName: this.question.controlName,
      type: "push",
      value: this.multipleTextValues,
      pushValue: pushValue
    });
  }

  removeTextMultiple(index) {
    let removeValue = this.multipleTextValues[index];
    this.multipleTextValues.splice(index, 1);
    this.saveValue();
    // notify for anything trying to monitor changes to array (e.g. repeat groups)
    this.events.publish("arrayChange:" + this.question.controlName, {
      controlName: this.question.controlName,
      type: "splice",
      index: index,
      value: this.multipleTextValues,
      removeValue: removeValue
    });
  }

  enableEdit(i) {
    this.multipleTextInput = this.multipleTextValues[i];
    this.editMode = true;
    this.editIndex = i;
    this.textMultipleInput.setFocus();
  }
  saveEdits() {
    this.multipleTextValues[this.editIndex] = this.multipleTextInput;
    this.multipleTextInput = "";
    this.editMode = false;
    this.editIndex = -1;
    this.saveValue();
  }
}
