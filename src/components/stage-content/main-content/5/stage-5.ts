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
    {heading:'Sampling Unit',image:'',formControl:'q3.5', stage:'stage-3'},
    {heading:'Reporting Level',image:'',formControl:'q4.3', stage:'stage-4'},
  ]
  builderStages:any=[];
  stageBuilt:any={}

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
  builderSlideChange(){
    // update multi-stage builder text if appropriate
    try {
      this.builderStages = JSON.parse(this.form.value['q5.2'])
      console.log('builder stages',this.builderStages)
    } catch (error) {
      this.builderStages = []
    }
  }
  buildStage(index){
    console.log('building stage',index)
    let builderStage={
      index:index,
      title:this.builderStages[index]
    }
    super.openModal('FrameBuilderPage',builderStage)
  }

}
