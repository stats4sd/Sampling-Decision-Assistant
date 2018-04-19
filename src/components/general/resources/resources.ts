import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular'
import animationStates from '../../../providers/animationStates'
import { select } from '@angular-redux/store'
import { Observable } from 'rxjs/Observable'

// import demoResources from './data/demo-resources';
// import stage1Resources from './data/stage-1-resources'
// import stage2Resources from './data/stage-2-resources'
// import stage3Resources from './data/stage-3-resources'
// import stage4Resources from './data/stage-4-resources'
// import stage5Resources from './data/stage-5-resources'
// import stage6Resources from './data/stage-6-resources'
import { DomSanitizer } from '@angular/platform-browser';
// dev
import { AngularFirestore } from 'angularfire2/firestore';


@Component({
  selector: 'resources',
  templateUrl: 'resources.html',
  animations: [animationStates]
})
export class ResourcesComponent {

  @select(['view','params','relevant']) readonly relevant$: Observable<string> 

  @Input() set stage(stage: number) {
    this.setResources(this.allResources[stage])
    this._stage=stage
  }

  _stage:number
  allResources=[]
  // allResources = [demoResources, stage1Resources, stage2Resources, stage3Resources, stage4Resources, stage5Resources, stage6Resources]
  questions: any[] = []
  relevant: string = "N/A"
  videoPlayerWidth:number=675
  videoPlayerHeight:number=450

  constructor(private events: Events, private sanitizer: DomSanitizer, private db:AngularFirestore) {
    this.relevant$.subscribe(
      r=>{if(r){this.showRelevant(r)}}
    )
    this.db.collection('resources').valueChanges().subscribe(
      res=>{
        this.allResources=res
        this.setResources(this.allResources[this._stage])

      }
    )
  }

  ngAfterViewInit(){
    // set video player width
  }

  setResources(stageResources: any) {
    // convert json objecto to array
    if(stageResources){
      let questions = []
    Object.keys(stageResources.questions).forEach(k => {
      questions.push(stageResources.questions[k])
    })
    this.questions = questions
    }
    
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
      format = 'audio'
    }
    if (q.youtubeID) {
      // set video url to play hosted video (note, will need diff method if on mobile device)
      // q.videoUrl = this.sanitizer.bypassSecurityTrustUrl(location.origin + '/assets/resources/' + q.video)
      format = 'video'
    }
    else { format = 'text' }
    return format
  }

  showRelevant(relevant:string) {
    console.log('showing relevant', relevant)
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
