import { Component, ViewChild, OnInit } from '@angular/core';
import { Slides} from 'ionic-angular'
import { StagePage } from '../../../../pages/sampling tool/step-by-step/stage/stage';
import { FormArray, FormGroup } from '@angular/forms';


@Component({
  selector: 'stage-5',
  templateUrl: 'stage-5.html'
})
export class Stage5Component extends StagePage {
  

  infoProvided=[
    {heading:'Main Objective',image:'',formControl:'q1.3', stage:'stage-1'},
    {heading:'Key Indicator',image:'',formControl:'q2.1.1', stage:'stage-2'},
    {heading:'Sampling Unit',image:'',formControl:'q3.5', stage:'stage-3'},
    {heading:'Reporting Level',image:'',formControl:'q4.3', stage:'stage-4'},
  ]
  builderStages:any=[];
  stageBuilt:any={};
  processed={
    estimates:[]
  }

  @ViewChild('frameBuilder') frameBuilder:Slides;
  frameBuilderIndex:number=0

  goBack(){
    this.navCtrl.pop()
  }
  ngOnInit(){
    this._processValues()

  }
  _processValues(){
    // perform specific tasks related to displaying survey values in nice way
    if(this.form.value['q4.1']=='Disaggregated estimates'){
      // put disaggregated estimates back into array format for display
      try {
        this.processed.estimates=JSON.parse(this.form.value['q4.2'])
      } catch (error) {
        
      }
    }
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
    
    this.dataPrvdr.saveSurvey(null,true)
    
  }
  buildStage(index:number,title){
    let builderStage={
      index:index,
      title:title
    }
    super.openModal('FrameBuilderPage',builderStage)
  }

}
