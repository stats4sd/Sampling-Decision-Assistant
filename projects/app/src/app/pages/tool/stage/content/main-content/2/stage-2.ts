import { Component } from "@angular/core";
import { StagePage } from "src/app/pages/tool/stage/stage.page";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "stage-2",
  templateUrl: "stage-2.html",
  styleUrls: ["stage-2.scss"]
})
export class Stage2Component extends StagePage {
  // could use select, but as data not streamed into template becomes messier for unsubscribe
  sdLower$: Subscription;
  sdUpper$: Subscription;
  sd: number;

  ngOnInit() {
    this._addSubsriptions();
    this._calculateSD();
  }

  ngOnDestroy() {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }

  // manage subscribe and unsubscribe in declarative way
  // see: https://netbasal.com/when-to-unsubscribe-in-angular-d61c6b21bad3
  _addSubsriptions() {
    // listen for updates on min/max values to automatically calculate s.d
    this.sdLower$ = this.ngRedux
      .select(["activeProject", "values", "q2.2.3"])
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(v => {
        this._calculateSD();
      });
    this.sdUpper$ = this.ngRedux
      .select(["activeProject", "values", "q2.2.4"])
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(v => {
        this._calculateSD();
      });
  }
  _calculateSD(lower?, upper?) {
    try {
      const values = this.ngRedux.getState().activeProject.values;
      if (!lower) {
        lower = Number(values["q2.2.3"]);
      }
      if (!upper) {
        upper = Number(values["q2.2.4"]);
      }
      console.log("calculating sd", lower, upper);
      let sd = (upper - lower) / 6;
      // round to 2dp with scaling support (avoid long float numbers)
      sd = Math.round((sd + 0.00001) * 100) / 100;
      this.sd = sd;
      if (sd != parseFloat(values["q2.2.2"])) {
        let patch = {};
        // save as string to keep consistent with inputs (even though later converted back to number)
        patch["q2.2.2"] = sd.toString();
        // patch only works if exists so also provide option to add control
        if (!values["q2.2.2"]) {
          this.formPrvdr.formGroup.addControl(
            "q2.2.2",
            this.formPrvdr.fb.control("")
          );
        }
        this.formPrvdr.formGroup.patchValue(patch);
        this.dataPrvdr.backgroundSave();
      }
    } catch (error) {}

    // calculate sd, only update form value if different to previous
  }
}
