import { Component, Input } from '@angular/core';
import { DataProvider } from '../../../providers/data/data';
import { FormProvider } from '../../../providers/form/form';
import { FormGroup } from '@angular/forms/src/model';
import { StagePage } from '../../../pages/sampling tool/stage/stage';

import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import animationStates from '../../../providers/animationStates';

@Component({
  selector: 'stage-complete',
  templateUrl: 'stage-complete.html',
  animations: [animationStates]
})
export class StageCompleteComponent extends StagePage {
  @select(['activeProject', 'stagesComplete']) readonly stagesComplete$: Observable<boolean[]>;
  @select(['activeProject', 'title']) readonly projectTitle$: Observable<string>;
  @Input('disabled') disabled: boolean
  @Input('stageNumber') stageNumber: number
  @Input('text') text: string;
  @Input('hideButton') hideButton: boolean;

  lastCall: number = 0
  sectionValid: boolean = false
  stagesComplete: boolean[] = []
  projectTitle:string;
  projectTitleInput:string;

  ngOnInit() {
    // subscribe to form value changes to mark when section complete
    this.checkSectionValid()
    this.formValues$.subscribe(
      v => {
        if (v) {
          this.checkSectionValid()
        }
      }
    )
    this.stagesComplete$.subscribe(s => {
      if (s) {
        this.stagesComplete = s
      }
    })
    this.projectTitle$.subscribe(
      t=>this.projectTitle=t
    )
  }

  saveProjectTitle(){
    this.dataPrvdr.activeProject.title=this.projectTitleInput
    this.projectActions.setActiveProject(this.dataPrvdr.activeProject)
    this.dataPrvdr.backgroundSave()    
  }

  checkSectionValid() {
    // initial function to throttle verification call to only run max once per 200ms to avoid multiple change detection calls
    const now = (new Date).getTime()
    if (now - this.lastCall > 300) {
      this.lastCall = now
      setTimeout(() => {
        let v={}
        try {
          v = this.ngRedux.getState().activeProject.values
        } catch (error) {}
        this.sectionValid = this.verify(this.stage.number, v)
      }, 200);
    }
  }


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
          // *** add back in ***
          // this.dataPrvdr.activeProject.stagesComplete[1] = false
          this.stagesComplete[1] = false
          // this.projectActions.updateProjectCompletion(this.stagesComplete)
          return false
        }
      }
      case s == 2: {
        if (v['q2.3.1']) { return true }
        else if (v['q2.2.3'] && v['q2.2.4']) { return true }
        else {
          // this.dataPrvdr.activeProject.stagesComplete[2] = false
          return false
        }

      }
      case s == 3: {
        // add patch for 3.5 value
        // this._patchSection3(v)

        return true
      }
      case s == 4: {
        if (v['reportingLevels']) { return true }
        if (v['q4.3']) { return true }
      }
      case s == 5: {
        //console.log('evaluating section valid 5')
        return true
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

  nextStage() {
    // push next stage page and remove currnet page from nav stack to allow direct nav back to home. Could also be done with slugs, will need
    // method to recognise stage-2 -> stage-1 when wanting to go fully back and auto pop history
    let next: number = this.stage.number + 1
    // remove any existing stagePart hash params
    this.customRouter.removeHashParam('stagePart')
    // push new page and remove duplicate stack
    this.navCtrl.push('StagePage', { stageID: 'stage-' + next }).then(
      _ => {
        this.navCtrl.remove(this.navCtrl.length() - 2)
      }
    )
  }

  toggleCheckbox() {
    this.projectActions.updateStagesComplete(this.stagesComplete)
    this.dataPrvdr.backgroundSave()
  }

  //   _patchSection3(values) {
  //     console.log('patching section 3')
  //     // quick patch to merge section 3 values into one 
  //   let text = values['q3.1']
  //   if (values['q3.2']) {
  //     text = text + " located in " + values['q3.2']
  //   }
  //   if (values['q3.3']) {
  //     text = text + " during " + values['q3.3']
  //   }
  //   if (values['q3.4']) {
  //     text = text + " and " + values['q3.4']
  //   }
  //   else { text = "" }
  //   if (values['q3.5'] != text) {
  //     let patch = {}
  //     patch['q3.5'] = text
  //     this.form.patchValue(patch)
  //   }
  // }

}