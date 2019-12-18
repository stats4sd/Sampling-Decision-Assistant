/* Takes a question and binds to appropriate input mechanism 
utilises custom form binding, find out more here:
// https://netbasal.com/angular-custom-form-controls-made-easy-4f963341c8e2
// http://anasfirdousi.com/how-to-make-custom-angular-components-form-enabled-ngModel-enabled.html
// http://blog.rangle.io/angular-2-ngmodel-and-custom-form-components/
*/

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  forwardRef
} from "@angular/core";
import {
  FormGroup,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl
} from "@angular/forms";
import { Events } from "@ionic/angular";
import { FormProvider } from "src/app/services/form/form";
import { DataProvider } from "src/app/services/data/data";
import { Question } from "../../../models/models";
import { fadein } from "src/app/services/animationStates";
import { getControlName } from "src/app/hacks";

// settings to enable a model binding
export const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SurveyQuestionComponent),
  multi: true
};

@Component({
  selector: "survey-question",
  templateUrl: "survey-question.html",
  styleUrls: ["survey-question.scss"],
  providers: [VALUE_ACCESSOR],
  animations: [fadein]
})
export class SurveyQuestionComponent implements ControlValueAccessor {
  @Input("question")
  question: Question;
  @Input("showLabel")
  showLabel: boolean;
  @Input("inline")
  inline: boolean;
  @Input()
  set controlName(controlName: string) {
    this.question = this.formPrvdr.getQuestion(controlName);
  }
  @Input("formGroup")
  formGroup: FormGroup;
  @Input("reviewMode")
  reviewMode: boolean;
  @Output()
  onValueChange = new EventEmitter<any>();
  @ViewChild("textAreaInput", { static: false })
  textAreaInput: ElementRef;
  @ViewChild("saveMessage", { static: true })
  saveMessage: ElementRef;

  value: any;
  propagateChange: any = () => {};
  savePending: boolean;
  showQuestion: boolean = true;
  initComplete: boolean = false;
  questionKey: string;
  selectOtherValue: any = "";
  selectOptions: string[];
  initialScrollHeight: number;
  showSelectOther: boolean = false;
  originalLabel: string;
  dynamicText: any = {};
  trackingChanges: boolean = false;

  valueSaved: boolean = false;

  constructor(
    public cdr: ChangeDetectorRef,
    public events: Events,
    public formPrvdr: FormProvider,
    public dataPrvdr: DataProvider
  ) {
    this.events.subscribe("valueUpdate", data => this.updateLabel(data.key));
  }
  get controlName() {
    return getControlName(this.question.controlName);
  }

  // **********************************************************************************************
  // specific functions for question types which could be later moved to individual components
  //***********************************************************************************************

  ngOnInit() {
    // initialise master formgroup if a subformgroup not specified
    if (!this.formGroup) {
      this.formGroup = this.formPrvdr.formGroup;
    }
    // attach additional condition triggers
    this.checkFormControl();
    this.checkQuestionConditions();
    this._prepareDynamicText();
    if (this.question.triggers && this.question.triggers.trigger == "onInit") {
      this._runCustomTriggers();
    }
    // apply specific init for question types
    if (this.question.type == "select") {
      this.generateSelectOptions();
    }

    // track value changes for any manual bindings and control add/remove
    if (this.formGroup.value[this.question.controlName]) {
      this.value = this.formGroup.value[this.question.controlName];
    }
    // subscribe to changes
    this.formGroup.valueChanges.subscribe(v => {
      if (v) {
        // re-evaluate question condition if has condition and condition value changed
        if (this.question.conditionJson) {
          this.checkQuestionConditions();
        }
        // update manual value bindings and save if this is updated
        if (
          v[this.question.controlName] &&
          v[this.question.controlName] != "N/A"
        ) {
          this.value = v[this.question.controlName];
          this.dataPrvdr.backgroundSave();
        }
      }
    });
    this.initComplete = true;
  }

  ngOnDestroy() {
    this.events.unsubscribe("valueUpdate");
    // detach change detector to prevent trying to detect destroyed question error
    this.cdr.detach();
  }

  checkFormControl() {
    // checks form control exists (in case removed or new question) and adds appropriately
    // console.log('checking form control',this.question)
    if (!this.formGroup.controls[this.question.controlName]) {
      this.formGroup.addControl(
        this.question.controlName,
        new FormControl(
          this.formPrvdr.historicValues[this.question.controlName]
        )
      );
      this.formGroup.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false
      });
    }
  }

  // ************** select **************************************************
  selectUpdated(value) {
    if (value == "Other (please specify)") {
      this.showSelectOther = true;
    }
    // else {
    //   this.valueUpdated(value)
    // }
  }
  generateSelectOptions() {
    // parse select options to array
    if (this.question.selectOptions) {
      this.selectOptions = this.question.selectOptions;
      // if value not in options populate
      let value = this.formPrvdr.getSurveyValue(this.question.controlName);
      if (value != "") {
        if (this.selectOptions.indexOf(value) == -1) {
          this.selectOtherValue = value;
        }
      }
    }
  }

  updateSelectOther(e) {
    let value = e.target.value;
    let patch = {};
    let key = this.question.controlName;
    patch[key] = value;
    this.formPrvdr.formGroup.patchValue(patch);
    if (value == "") {
      this.showSelectOther = false;
    }
  }
  // ************** Range **************************************************
  updateRange(e) {
    const patch = { [this.question.controlName]: e.target.value };
    this.formPrvdr.formGroup.patchValue(patch);
  }

  // *****************************************************
  // functions required to allow model binding
  //******************************************************

  writeValue(value: any) {
    // method auto bound for ng-model write
    if (value) {
      this.value = value;
    }
  }
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: () => void): void {}

  // generic change function, sometimes uses value from bound ngmodel, sometimes from change function calls
  valueUpdated(value?, e?) {
    if (!value) {
      value = this.value;
    }
    if (e) {
      value = e.target.value;
    }
    // patch formgroup
    let patch = {};
    patch[this.question.controlName] = value;
    this.formGroup.patchValue(patch);
    // propagate value update for use in ngModel or form binding
    this.propagateChange(value);
    // notify change through emitter also for tracking in repeat group questions
    this.onValueChange.emit(value);
  }

  // **********************************************************************************************
  // Other functions
  //***********************************************************************************************

  updateLabel(key) {
    // updates dynamic text labels if relevant
    if (this.dynamicText[key]) {
      console.log("updating label");
      let value = this.formPrvdr.getSurveyValue(key);
      let el = document.getElementById(this.question.type + "LabelText");
      if (el) {
        let instances = el.querySelectorAll(".dynamic-text");
        for (let i = 0; i < instances.length; i++) {
          if (instances[i].getAttribute("name") == key) {
            instances[i].innerHTML = value;
          }
        }
      }
    }
  }

  _runCustomTriggers() {
    // fires custom triggers saved in the question object
    if (this.question.triggers) {
      console.log("running custom trigger", this.question);
      eval(this.question.triggers.function);
      this.cdr.detectChanges();
    }
  }
  setValue(controlName, value, stringify?) {
    // called from custom triggers to set another value
    setTimeout(() => {
      // running as timeout to avoid change detection issues
      if (stringify) {
        value = JSON.stringify(value);
      }
      console.log("setting value", controlName, value);
      let patch = {};
      patch[controlName] = value;
      this.formPrvdr.formGroup.patchValue(patch);
    });
  }

  _prepareDynamicText() {
    // search through text string for instances of variable references contained between {{ }}
    // NOTE, could be improved via event listeners for updates? (and possibly change event listener to announce which question changed)

    let str: string = this.question.label;
    this.originalLabel = str;
    if (str.indexOf("{{") > -1) {
      // regex pattern enclosed between / ... /
      let matches = { text: [], vars: [], replacements: [] };
      matches.text = str.match(/\{\{[^}]+\}\}/gm);
      if (matches.text != null) {
        matches.vars = matches.text.map(function(x) {
          return x.match(/[\w\.]+/)[0];
        });
      }
      matches.vars.forEach((val, i) => {
        // populate match text and current val. get current val from provider in case it is outside of current question group
        this.dynamicText[val] = {
          matchText: matches.text[i],
          currentValue: this.formPrvdr.formGroup.value[val]
        };
        // apply css
        let el = document.getElementById(this.question.type + "LabelText");
        // use split/join to target all instances of text, apply name attribute for tracking later
        try {
          el.innerHTML = el.innerHTML
            .split(matches.text[i])
            .join(
              "<span class='dynamic-text' name='" + val + "'>" + val + "</span>"
            );
        } catch (error) {}
        this.updateLabel(val);
      });
    }
  }

  resize() {
    // increase height on text area automatically except when first entry row (looks jumpy otherwise as 10px increase on first char)
    if (this.textAreaInput) {
      let scrollHeight = this.textAreaInput.nativeElement.scrollHeight;
      if (!this.initialScrollHeight) {
        this.initialScrollHeight = scrollHeight;
      }
      if (scrollHeight > this.initialScrollHeight) {
        this.textAreaInput.nativeElement.style.height = "auto";
        this.textAreaInput.nativeElement.style.height =
          this.textAreaInput.nativeElement.scrollHeight + 10 + "px";
      }
    }
  }

  // slightly messy set of bindings to essentially track a formgroup as it changes and add/remove relevant controls
  checkQuestionConditions(values?) {
    // test logic from condition property against form
    let applicable: boolean = true;

    if (
      this.question.hasOwnProperty("condition") &&
      this.question.condition != ""
    ) {
      // convert condition string to json (could be done in form builder)
      if (!this.question.conditionJson) {
        this.question.conditionJson = this.formPrvdr._generateConditionOptions(
          this.question.condition
        );
      }
      // if values not given load master formgroup value
      if (!values) {
        values = this.formGroup.value;
      }
      let dependentValue = values[this.question.conditionJson.controlName];
      // test applicability conditions
      if (this.question.conditionJson.type == "prerequisite") {
        applicable = dependentValue && dependentValue != "";
      } else if (this.question.conditionJson.type == "value") {
        applicable = dependentValue == this.question.conditionJson.value;
      }
      // case not applicable
      if (applicable == false) {
        // assign N/A value to non-applicable question
        if (values[this.question.controlName] != null) {
          let patch = {};
          patch[this.question.controlName] = null;
          this.formGroup.patchValue(patch);
        }
      }
      // case applicable
      else {
        // assign historic if it differs from current null/reassigned value
        if (values[this.question.controlName] == null) {
          let patch = {};
          let patchValue = this.formPrvdr.historicValues[
            this.question.controlName
          ]
            ? this.formPrvdr.historicValues[this.question.controlName]
            : "";
          patch[this.question.controlName] = patchValue;
          this.value = patchValue;
          this.formGroup.patchValue(patch);
        }
      }
    }
    this.showQuestion = applicable;
  }
}
