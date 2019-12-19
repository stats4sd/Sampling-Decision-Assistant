import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { select } from "@angular-redux/store";
import { NavParams, ModalController } from "@ionic/angular";
import { DataProvider } from "src/app/services/data/data";
import { FormProvider } from "src/app/services/form/form";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-frame-builder",
  templateUrl: "./frame-builder.page.html",
  styleUrls: ["./frame-builder.page.scss"]
})
export class FrameBuilderPage implements OnInit {
  removeSubscriptions$ = new Subject();
  stageFormGroup: FormGroup;
  parentStageName: string;
  stageName: string;
  stageRepeatIndex: number;
  stageIndex: number;
  reportingLevels: any;
  @select(["activeProject", "values", "reportingLevels"])
  reportingLevels$: Observable<any>;

  constructor(
    private dataPrvdr: DataProvider,
    private formPrvdr: FormProvider,
    private modalCtrl: ModalController,
    navParams: NavParams
  ) {
    this.stageRepeatIndex = navParams.data.stageIndex;
    this.stageName = this.getStageName(this.stageRepeatIndex);
    this.parentStageName = this.getStageName(this.stageRepeatIndex - 1);

    this._buildFormGroup();
    this._preloadValues();
  }

  getStageName(i: number) {
    try {
      return this.formPrvdr.formGroup.value.samplingStages[i].name;
    } catch (error) {
      return null;
    }
  }

  ngOnInit() {
    this._addValueSubscribers();
  }
  ngOnDestroy(): void {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }

  dismiss() {
    if (this.stageFormGroup.value["q5.3.1"]) {
      this._patchValue({ _built: true });
    }
    this.dataPrvdr.backgroundSave();
    this.modalCtrl.dismiss();
  }

  private _buildFormGroup() {
    // generate a new formgroup which will be used to hold information saved in these questions

    let builderQuestions: any = this.formPrvdr.allQuestions;
    builderQuestions = builderQuestions.filter(q => {
      return q.repeatGroup == "q5.3";
    });
    let builderForm = this.formPrvdr._generateQuestionForm(builderQuestions);
    this.stageFormGroup = builderForm;
  }

  private _preloadValues() {
    let currentValue = this.formPrvdr.formGroup.value.samplingStages[
      this.stageRepeatIndex
    ];
    console.log("current value", currentValue);
    Object.keys(currentValue).forEach(k => {
      // build additional controls for thing like name and built status which aren't included in questions
      if (!this.stageFormGroup.controls[k]) {
        this.stageFormGroup.addControl(k, new FormControl());
      }
    });
    this.stageFormGroup.patchValue(currentValue);
  }

  private _addValueSubscribers() {
    // listen to changes on this formgroup and reflect on master
    this.stageFormGroup.valueChanges
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(v => {
        if (v) {
          this._patchValue(v);
        }
      });
    this.reportingLevels$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(levels => (this.reportingLevels = levels));
  }

  private _patchValue(update: any) {
    // update value on master group
    let currentValue = this.formPrvdr.formGroup.value.samplingStages;
    Object.keys(update).forEach(k => {
      currentValue[this.stageRepeatIndex][k] = update[k];
    });
    this.formPrvdr.formGroup.patchValue({ samplingStages: currentValue });
  }
}
