import { Component, ViewChild } from '@angular/core';
import { StagePage } from '../../../../pages/sampling tool/stage/stage';
import { Slides } from 'ionic-angular';


@Component({
  selector: 'stage-6',
  templateUrl: 'stage-6.html'
})
export class Stage6Component extends StagePage {
  selectedNode: any = {}
  initComplete: boolean

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    if (this.stageSlides) {this.stageSlides.lockSwipes(true)}
    setTimeout(_ => this.initComplete = true, 200)

  }
  // launchSampleSizeCalculator() {
  //   this.modalCtrl.create('SampleSizeCalculatorPage').present()
  // }
  goBack() {
    this.navCtrl.pop()
  }

  nextStage() {
    this.navCtrl.pop()
  }
}