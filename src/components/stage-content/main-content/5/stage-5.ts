import { Component, ViewChild, OnInit } from '@angular/core';
import { Slides } from 'ionic-angular'
import { StagePage } from '../../../../pages/sampling tool/stage/stage';
import { FormArray, FormGroup } from '@angular/forms';


@Component({
  selector: 'stage-5',
  templateUrl: 'stage-5.html'
})
export class Stage5Component extends StagePage {

  builderStages: any = [];
  stageBuilt: any = {};
  showStrataDefineSlide: boolean = false

  // @ViewChild('stageSlides') stageSlides: Slides;


  ngAfterViewInit() {
    if (this.stageSlides) {
      this.stageSlides.lockSwipes(true)
    }
    // breadcrumb listener
    this.attachBreadcrumbSubscriber()

  }
  goBack() {
    this.navCtrl.pop()
  }
  nextStage() {
    this.navCtrl.push('StagePage', { stageID: 'stage-6' }).then(
      _ => {
        this.navCtrl.remove(this.navCtrl.length() - 2)
      }
    )
  }

  editStage(stage) {
    // super.openModal('StagePage', { stageID: stage, modalMode: true })
    super.pushPage('StagePage', { stageID: stage })
  }

  buildStage(stageFormControl, stageIndex) {
    // get formgroup matching stage name to parentID
    let params = { stageFormGroup: stageFormControl, stageIndex: stageIndex}
    super.openModal('FrameBuilderPage', params)
  }

  // _showStrataDefineSlide(){
  //   for(let stage of this.form.value['q5.3']){
  //     if(stage['q5.3.4.1']=='Yes'){return true}
  //   }
  //   return false
  // }
  // stageSlideChange() {
  //   this.dataPrvdr.saveSurvey(null, true)
  //   this.stageSlidesIndex = this.stageSlides.getActiveIndex()
  //   this.showStrataDefineSlide = this._showStrataDefineSlide()
  // }





}
