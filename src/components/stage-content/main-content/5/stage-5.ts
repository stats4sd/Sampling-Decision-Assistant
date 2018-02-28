import { Component, ViewChild, OnInit } from '@angular/core';
import { Slides } from 'ionic-angular'
import { StagePage } from '../../../../pages/sampling tool/step-by-step/stage/stage';
import { FormArray, FormGroup } from '@angular/forms';


@Component({
  selector: 'stage-5',
  templateUrl: 'stage-5.html'
})
export class Stage5Component extends StagePage {


  infoProvided = [
    { heading: 'Main Objective', image: '', formControl: 'q1.3', stage: 'stage-1' },
    { heading: 'Key Indicator', image: '', formControl: 'q2.1.1', stage: 'stage-2' },
    { heading: 'Sampling Unit', image: '', formControl: 'q3.5', stage: 'stage-3' },
    { heading: 'Reporting Level', image: '', formControl: 'q4.3', stage: 'stage-4' },
  ]
  builderStages: any = [];
  stageBuilt: any = {};
  frameBuilderActiveSlide:number=0;
  showStrataDefineSlide:boolean=false

  @ViewChild('frameBuilder') frameBuilder: Slides;
  frameBuilderIndex: number = 0

  ngAfterViewInit() {
    if (this.frameBuilder) {
      this.frameBuilder.lockSwipes(true)
    }

  }
  goBack() {
    this.navCtrl.pop()
  }
  nextStage(){
    this.navCtrl.push('StagePage', { stageID: 'stage-6'}).then(
      _ => {
        this.navCtrl.remove(this.navCtrl.length() - 2)
      }
    )
  }

  nextStep() {
    this.frameBuilder.lockSwipes(false)
    this.frameBuilderIndex++
    this.frameBuilder.slideNext()
    this.frameBuilder.lockSwipes(true)
  }
  lastStep() {
    this.frameBuilder.lockSwipes(false)
    this.frameBuilderIndex--
    this.frameBuilder.slidePrev()
    this.frameBuilder.lockSwipes(true)
  }
  editStage(stage) {
    super.openModal('StagePage', { stageID: stage, modalMode: true })
  }
  builderSlideChange() {
    this.dataPrvdr.saveSurvey(null, true)
    this.frameBuilderActiveSlide=this.frameBuilder.getActiveIndex()
    this.showStrataDefineSlide = this._showStrataDefineSlide()
  }
  buildStage(stageFormControl, stageIndex) {
    // get formgroup matching stage name to parentID
    let params = { stageFormGroup: stageFormControl, stageIndex: stageIndex }
    super.openModal('FrameBuilderPage', params)
  }

  _showStrataDefineSlide(){
    for(let stage of this.form.value['q5.3']){
      if(stage['q5.3.4.1']=='Yes'){return true}
    }
    return false
  }

}
