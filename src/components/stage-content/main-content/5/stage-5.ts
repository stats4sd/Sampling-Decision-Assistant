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
}
