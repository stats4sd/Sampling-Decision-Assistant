import { Component, ChangeDetectorRef, ViewChild } from "@angular/core";
import { SurveyQuestionComponent } from "../../survey-question/survey-question";
import { FormControl } from "@angular/forms";
import { DragulaService } from "ng2-dragula";
import { Events, TextInput } from "ionic-angular";
import { FormProvider } from "../../../../providers/form/form";
import { DataProvider } from "../../../../providers/data/data";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";

/*
Custom component to add multiple stages, populate repeat formgroup and give option to remove or reorder
*/

@Component({
  selector: "question-custom-stages-define",
  templateUrl: "question-custom-stages-define.html"
})
export class QuestionCustomStagesDefineComponent extends SurveyQuestionComponent {
  @select(["activeProject", "values", "q3.1"])
  readonly finalSamplingUnit$: Observable<string>;
  @select(["activeProject", "values"])
  readonly formValues$: Observable<any>;
  @ViewChild("textMultipleInput")
  textMultipleInput: TextInput;

  multipleTextInput: string;
  stages: any[] = [];
  dragulaOptions = {
    moves: function(el, source, handle, sibling) {
      return handle.parentElement.dataset.dragHandle == "drag";
    }
  };
  finalSamplingUnit: string = "";
  editMode: boolean;
  editIndex: number; ///////////////////////////////////////////////////////////////////////////////////////////////

  /************** custom reporting levels *********************************************************
  similar code and template to multiple text input, but builds form controls instead of string array
  could try find better way to combine/reuse code
  */ constructor(
    // repeat parent constructor to add additional dragula service
    private dragulaService: DragulaService,
    cdr: ChangeDetectorRef,
    events: Events,
    public formPrvdr: FormProvider,
    public dataPrvdr: DataProvider
  ) {
    super(cdr, events, formPrvdr, dataPrvdr);
  }

  ngOnInit() {
    // run init on fsu changes
    this.finalSamplingUnit$.subscribe(fsu => this._init(fsu));
    // rewrite query param on value update (annoying bug in platform that changes hash on action sheet present)
  }

  ngAfterViewInit() {
    this._addDragDropSubscriber();
  }

  // on fsu update init function creates a sampling stage for the final sampling unit (if doesn't exist)
  // and if stages exist runs check that fsu correctly named in case of changes
  _init(fsu?) {
    let values = this.formPrvdr.formGroup.value;
    if (!fsu) {
      fsu = "Final Sampling Unit";
    }
    let stages;
    // build group template if doesn't exist or undefined
    if (!values.samplingStages || !(values.samplingStages instanceof Array)) {
      this.formPrvdr.formGroup.addControl(
        "samplingStages",
        new FormControl([{ name: fsu }])
      );
      stages = [{ name: fsu }];
    }
    // otherwise ensure final sampling unit named correctly
    else {
      stages = values.samplingStages.slice(0);
      if (stages.length > 0) {
        stages[stages.length - 1].name = fsu;
      } else {
        stages = [{ name: fsu }];
      }
    }
    this.stages = stages;
    this.finalSamplingUnit = fsu;
    this.patchForm();
  }

  validateInput() {
    // use regex to allow only alphanumberic (includes  _), whitespace and dash
    this.multipleTextInput = this.multipleTextInput.replace(/[^\w\-\s]/gi, "");
  }

  patchForm() {
    let form = this.formPrvdr.formGroup;
    let patch: any = {};
    patch.samplingStages = this.stages;
    // patch only works if exists so also provide option to add control
    if (!form.controls.samplingStages) {
      form.addControl("samplingStages", new FormControl());
    }
    form.patchValue(patch);
  }

  addSamplingStage(name?) {
    // push response to array
    if (!name) {
      name = this.multipleTextInput;
    }
    if (name == "") {
      name = "Final Sampling Unit";
    }
    this.multipleTextInput = "";
    this.stages.unshift({ name: name });
    this.patchForm();
  }

  removeSamplingStage(index, value) {
    this.stages.splice(index, 1);
    this.patchForm();
  }

  enableEdit(i) {
    this.multipleTextInput = this.stages[i].name;
    this.editMode = true;
    this.editIndex = i;
    this.textMultipleInput.setFocus();
  }
  saveEdits() {
    this.stages[this.editIndex].name = this.multipleTextInput;
    this.multipleTextInput = "";
    this.editMode = false;
    this.editIndex = -1;
    this.patchForm();
  }

  _addDragDropSubscriber() {
    // automatically save form values when rearranged using drag drop. Push final sampling unit back to array and reverse
    this.dragulaService.dropModel.subscribe(_ => {
      console.log("drop");
      this.patchForm();
    });
  }
}
