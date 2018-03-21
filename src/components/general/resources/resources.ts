import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular'
import animationStates from '../../../providers/animationStates'

import stage1Resources from './data/stage-1-resources'
import stage2Resources from './data/stage-2-resources'
import stage3Resources from './data/stage-3-resources'
import stage4Resources from './data/stage-4-resources'
import stage5Resources from './data/stage-5-resources'
import stage6Resources from './data/stage-6-resources'
import { DomSanitizer } from '@angular/platform-browser';
import demoResources from './data/demo-resources';

@Component({
  selector: 'resources',
  templateUrl: 'resources.html',
  animations: [animationStates]
})
export class ResourcesComponent {

  @Input() set stage(stage: number) {
    this.setResources(this.allResources[stage])
  }
  allResources = [demoResources, stage1Resources, stage2Resources, stage3Resources, stage4Resources, stage5Resources, stage6Resources]
  questions: any[] = []
  relevant: string = "N/A"

  constructor(private events: Events, private sanitizer: DomSanitizer) {
    this.events.unsubscribe('help:clicked')
    this.events.subscribe('help:clicked', relevant => this.showRelevant(relevant))
    console.log('location', location.host, location)
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
    console.log('q', q)
  }
  chooseDefaultFormat(q) {
    let format
    if (q.audio) {
      q.audioUrl = this.sanitizer.bypassSecurityTrustUrl(location.origin + '/assets/resources/' + q.audio)
      format= 'audio'
    }
    if (q.video) {
      // set video url to play hosted video (note, will need diff method if on mobile device)
      q.videoUrl = this.sanitizer.bypassSecurityTrustUrl(location.origin + '/assets/resources/' + q.video)
      format= 'video'
    }
    else { format= 'text' }
    return format
  }

  showRelevant(relevant) {
    console.log('showing relevant',relevant)
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
