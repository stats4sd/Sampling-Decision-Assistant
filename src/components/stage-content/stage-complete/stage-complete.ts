import { Component, Input } from '@angular/core';
import { DataProvider } from '../../../providers/data/data';
import { FormProvider } from '../../../providers/form/form';
import { FormGroup } from '@angular/forms/src/model';
import { StagePage } from '../../../pages/sampling tool/step-by-step/stage/stage';

@Component({
  selector: 'stage-complete',
  templateUrl: 'stage-complete.html'
})
export class StageCompleteComponent extends StagePage {

  @Input('complete') complete: boolean
  @Input('disabled') disabled: boolean
  @Input('stageNumber') stageNumber: number
  @Input('text') text: string;
  lastCall: number = 0
  sectionValid: boolean = false


  verify(stageNumber: number, formValues) {
    const s = stageNumber
    // run verfication checks to see if form valid. takes current form values as input
    const v = formValues
    switch (true) {
      case s == 1: {
        if (v['q1.3']) { return true }
        if (v['q1.2'] == 'Non-representative') { return true }
        if (v['q1.1'] == 'A comparison that needs a quasi-experimental or an experimental approach') { return true }
        else {
          this.dataPrvdr.activeSurvey.stagesComplete[1] = false
          return false
        }
      }
      case s == 2: {
        if (v['q2.4']) { return true }
        else {
          this.dataPrvdr.activeSurvey.stagesComplete[2] = false
          return false
        }

      }
      case s == 3: {
        // add patch for 3.5 value
        return true
      }
      case s == 4: {
        if (v['q4.2']) { return true }
        if (v['q4.3']) { return true }
      }
      case s == 5: {
        console.log('evaluating section valid 5')
        break
      }
      case s == 6: {
        console.log('evaluating section valid 6')
        break
      }
      default: {
        console.log('default case')
        return true
      }
    }
  }

  checkSectionValid(v) {
    // initial function to throttle verification call to only run max once per 200ms to avoid multiple change detection calls
    const now = (new Date).getTime()
    if (now - this.lastCall > 300) {
      this.lastCall = now
      setTimeout(() => {
        this.sectionValid = this.verify(this.stage.number, v)
      }, 100);
    }

  }
  nextStage() {
    // push next stage page and remove currnet page from nav stack to allow direct nav back to home. Could also be done with slugs, will need
    // method to recognise stage-2 -> stage-1 when wanting to go fully back and auto pop history
    let next: number = this.stage.number + 1
    this.navCtrl.push('StagePage', { stageID: 'stage-' + next }).then(
      _ => {
        this.navCtrl.remove(this.navCtrl.length() - 2)
        //this.dataPrvdr.saveSurvey()
      }

    )
  }
  toggleCheckbox() {
    console.log('toggling checkbox', this.dataPrvdr.activeSurvey.stagesComplete[this.stage.number])
    if(this.stage.number==3){this._patchSection3()}
    this.dataPrvdr.saveSurvey()
  }
  _patchSection3() {
    let text = this.form.value['q3.1']
    if (this.form.value['q3.2']) {
      text = text + " located in " + this.form.value['q3.2']
    }
    if (this.form.value['q3.3']) {
      text = text + " during " + this.form.value['q3.3']
    }
    if (this.form.value['q3.4']) {
      text = text + " and " + this.form.value['q3.4']
    }
    else { text = "" }
    let patch = {}
    patch['q3.5'] = text
    this.form.patchValue(patch)
  }
}