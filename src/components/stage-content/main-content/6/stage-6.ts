import { Component, ViewChild } from '@angular/core';
import { StagePage } from '../../../../pages/sampling tool/step-by-step/stage/stage';
import { Slides } from 'ionic-angular';


@Component({
  selector: 'stage-6',
  templateUrl: 'stage-6.html'
})
export class Stage6Component extends StagePage {

  @ViewChild('stageSlides') stageSlides: Slides;
  stageSlidesIndex: number = 0

  ngAfterViewInit() {
    if (this.stageSlides) {
      this.stageSlides.lockSwipes(true)
    }

  }
  goBack() {
    this.navCtrl.pop()
  }

  nextStage(){
    this.navCtrl.pop()
  }

  nextStep() {
    this.stageSlides.lockSwipes(false)
    this.stageSlidesIndex++
    this.stageSlides.slideNext()
    this.stageSlides.lockSwipes(true)
  }
  lastStep() {
    this.stageSlides.lockSwipes(false)
    this.stageSlidesIndex--
    this.stageSlides.slidePrev()
    this.stageSlides.lockSwipes(true)
  }
  
  builderSlideChange() {
    this.dataPrvdr.saveSurvey(null, true)
    //this.stageSlidesActiveSlide=this.stageSlides.getActiveIndex()
  }

}