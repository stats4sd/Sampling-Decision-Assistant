import { Component, ViewChild, OnInit } from '@angular/core';
import { Slides} from 'ionic-angular'
import { StagePage } from '../../../../pages/sampling tool/step-by-step/stage/stage';

@Component({
  selector: 'stage-5',
  templateUrl: 'stage-5.html'
})
export class Stage5Component extends StagePage {

  infoProvided=[
    {heading:'Main Objective',image:'',formControl:'q1.3', stage:'stage-1'},
    {heading:'Key Indicator',image:'',formControl:'q2.2', stage:'stage-2'},
    {heading:'Sampling Unit',image:'',formControl:'q3.1', stage:'stage-3'},
    {heading:'Reporting Level',image:'',formControl:'q4.3', stage:'stage-4'},
  ]
  @ViewChild('frameBuilder') frameBuilder:Slides;
  frameBuilderIndex:number=0

  goBack(){
    this.navCtrl.pop()
  }
  ngOnInit(){
    console.log('stage 5 slides',this.frameBuilder)

  }
  nextStep(){
    this.frameBuilderIndex ++
    this.frameBuilder.slideNext()
  }
  lastStep(){
    this.frameBuilderIndex --
    this.frameBuilder.slidePrev()
  }
  editStage(stage){
    super.openModal('StagePage',{stageID:stage, modalMode:true})
  }

}
