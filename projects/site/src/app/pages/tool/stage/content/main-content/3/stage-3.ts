import { Component } from "@angular/core";
import { StagePage } from "src/app/pages/tool/stage/stage.page";
import { FormControl } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { select } from "@angular-redux/store";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "stage-3",
  templateUrl: "stage-3.html",
  styleUrls: ["stage-3.scss"]
})
export class Stage3Component extends StagePage {
  removeSubscriptions$ = new Subject();
  @select(["activeProject", "values", "q3.1"]) readonly val1$: Observable<
    string
  >;
  @select(["activeProject", "values", "q3.2"]) readonly val2$: Observable<
    string
  >;
  @select(["activeProject", "values", "q3.3"]) readonly val3$: Observable<
    string
  >;
  @select(["activeProject", "values", "q3.4"]) readonly val4$: Observable<
    string
  >;

  ngOnInit() {
    this.val1$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(v => this._generateSamplingUnit());
    this.val2$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(v => this._generateSamplingUnit());
    this.val3$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(v => this._generateSamplingUnit());
    this.val4$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(v => this._generateSamplingUnit());
    // dont want to use form value changes as calls too large a stack. better to use redux for individual
  }
  ngOnDestroy(): void {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }

  _generateSamplingUnit() {
    let v = this.form.value;
    if (v && v["q3.1"]) {
      let text = v["q3.1"];
      if (v["q3.2"]) {
        text = text + " located in " + v["q3.2"];
      }
      if (this.form.value["q3.3"]) {
        text = text + " during " + v["q3.3"];
      }
      if (this.form.value["q3.4"]) {
        text = text + " and " + v["q3.4"];
      }
      let patch = {};
      patch["q3.5"] = text;

      // patch only works if exists so also provide option to add control
      if (!this.form.value["q3.5"]) {
        this.form.addControl("q3.5", new FormControl(text));
      }
      if (this.form.value["q3.5"] != text) {
        console.log("patching sampling unit");
        console.log("form", this.form.value["q3.5"], "text", text);
        this.form.patchValue(patch);
      }
    }
  }
}
