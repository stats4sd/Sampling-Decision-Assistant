import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'stage-breadcrumbs',
  templateUrl: 'stage-breadcrumbs.html'
})
export class StageBreadcrumbsComponent {
  @Input() set stage(stage: number) {
    this.breadcrumbs = this.stageBreadcrumbs[stage]
  }
  @Input('stageSlidesIndex') stageSlidesIndex:number

  breadcrumbs: any = []
  stageBreadcrumbs = {
    4: ['Intro', 'Level Classifications','Review'],
    5: ['Intro', 'Sampling Stages', 'Building Frames'],
    6: ['Intro', 'Stratification','Sample Sizes', 'Resource Allocation']
  }

  constructor(private events:Events){

  }


  goTo(index){
    
    this.setHash(index)
    // this.events.publish('goToStageSlide',index)
  }

  // update the hash to have query-parameter style suffix to track breadcrumb sub-section 
  setHash(index){
    let hashArray = location.hash.split('/')
    const last = hashArray.pop()
    let newLast = last.split('?')[0]
    if(index!=0){newLast = newLast +'?part='+index}
    const newHash = hashArray.join('/')+'/'+newLast 
    location.hash=newHash
  }
} 