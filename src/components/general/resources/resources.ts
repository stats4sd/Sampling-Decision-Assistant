import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular'
import animationStates from '../../../providers/animationStates'

import stage1Resources from './data/stage-1-resources'
import stage2Resources from './data/stage-2-resources'
import stage3Resources from './data/stage-3-resources'
import stage4Resources from './data/stage-4-resources'
import stage5Resources from './data/stage-5-resources'
import stage6Resources from './data/stage-6-resources'

@Component({
  selector: 'resources',
  templateUrl: 'resources.html',
  animations: [animationStates]
})
export class ResourcesComponent {

  @Input() set stage(stage: number) {
    this.setResources(this.allResources[stage])
  }
  allResources = [null, stage1Resources, stage2Resources, stage3Resources, stage4Resources, stage5Resources, stage6Resources]
  questions: any[] = []
  relevant: string = "N/A"

  constructor(private events: Events) {
    this.events.unsubscribe('help:clicked')
    this.events.subscribe('help:clicked', relevant => this.showRelevant(relevant))
  }

  setResources(stageResources: any) {
    // convert json objecto to array
    let questions = []
    Object.keys(stageResources.questions).forEach(k => {
      questions.push(stageResources.questions[k])
    })
    console.log('resource questions', questions)
    this.questions = questions
  }

  viewResource(index: number, showFormat?: string) {

    // select format and toggle expand/contract on question
    let q = this.questions[index]
    if (showFormat) {
      q.showFormat = showFormat
      q.expanded = true
    }
    else {
      if (!q.showFormat) { q.showFormat = this.chooseDefaultFormat(q) }
      q.expanded = !q.expanded
    }
  }
  chooseDefaultFormat(q) {
    let format
    if (q.video) { return 'video' }
    else if (q.audio) { return 'audio' }
    else { return 'text' }
  }

  showRelevant(relevant) {
    // automatically expand relevant questions on click
    this.relevant = relevant
    this.questions.forEach((q, i) => {
      if (q.relevant && q.relevant.indexOf(relevant) > -1) {
        this.viewResource(i)
      }
      else { this.questions[i].expanded = false }
    });
  }

}
