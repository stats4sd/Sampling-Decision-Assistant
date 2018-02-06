import { Component } from '@angular/core';
import stage1Resources from './stage-1-resources'
import animationStates from '../../providers/animationStates'

@Component({
  selector: 'resources',
  templateUrl: 'resources.html',
  animations:[animationStates]
})
export class ResourcesComponent {

  resources: any;
  expanded = {}

  constructor() {
    this.resources = stage1Resources;
    console.log('resources', this.resources)
  }

  expandToggle(index) {
    if (!this.expanded[index]) { this.expanded[index] = true }
    else { this.expanded[index] = !this.expanded[index] }
    console.log('expanded',this.expanded)

  }

}
