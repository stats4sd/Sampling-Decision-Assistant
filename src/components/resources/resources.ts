import { Component, Input } from '@angular/core';
import {Events} from 'ionic-angular'
import animationStates from '../../providers/animationStates'

import stage1Resources from './stage-1-resources'
import stage2Resources from './stage-2-resources'
import stage3Resources from './stage-3-resources'
import stage4Resources from './stage-4-resources'
import stage5Resources from './stage-5-resources'
import stage6Resources from './stage-6-resources'

@Component({
  selector: 'resources',
  templateUrl: 'resources.html',
  animations: [animationStates]
})
export class ResourcesComponent {

  @Input() set stage(stage:number){
    this.resources=this.allResources[stage]
    console.log('resources',this.resources)
  }
  allResources=[null,stage1Resources,stage2Resources,stage3Resources,stage4Resources,stage5Resources,stage6Resources]
  resources: any
  expanded = {}

  constructor(private events:Events) {
    this.events.unsubscribe('help:clicked')
    this.events.subscribe('help:clicked', relevant => this.showRelevant(relevant))
  }

  expandToggle(index) {
    if (!this.expanded[index]) { this.expanded[index] = true }
    else { this.expanded[index] = !this.expanded[index] }

  }

  showRelevant(relevant){
    // automatically expand relevant questions on click
    this.resources.questions.forEach((r,i) => {
      if(r.relevant.indexOf(relevant)>-1){
        this.expanded[i]=true
      }
      else{this.expanded[i]=false}
    });
  }

}
