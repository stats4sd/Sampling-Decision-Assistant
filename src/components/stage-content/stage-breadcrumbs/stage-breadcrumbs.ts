import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'stage-breadcrumbs',
  templateUrl: 'stage-breadcrumbs.html'
})
export class StageBreadcrumbsComponent {
  @Input() set stage(stage: number) {
    console.log('setting stage',stage)
    this.breadcrumbs = this.stageBreadcrumbs[stage]
    console.log('breadcrumbs',this.breadcrumbs)
  }
  @Input('stageSlidesIndex') stageSlidesIndex:number

  breadcrumbs: any = []
  stageBreadcrumbs = {
    4: ['Intro', 'Level Classifications'],
    5: ['Intro', 'Sampling Stages', 'Building Frames'],
    6: ['Intro', 'Sample Sizes', 'Resource Allocation']
  }

  constructor(private events:Events){

  }


  goTo(index){
    this.events.publish('goToStageSlide',index)
  }
}