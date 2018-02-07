import { Component } from '@angular/core';
import {Events} from 'ionic-angular'
import stage1Resources from './stage-1-resources'
import animationStates from '../../providers/animationStates'

@Component({
  selector: 'resources',
  templateUrl: 'resources.html',
  animations: [animationStates]
})
export class ResourcesComponent {

  resources: any;
  expanded = {}

  constructor(private events:Events) {
    this.resources = stage1Resources;
    console.log('resources', this.resources)
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
