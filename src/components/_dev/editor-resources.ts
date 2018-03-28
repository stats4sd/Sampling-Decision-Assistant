import { Component, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ProjectActions } from '../../actions/actions';

import demoResources from '../general/resources/data/demo-resources'
import stage1Resources from '../general/resources/data/stage-1-resources'
import stage2Resources from '../general/resources/data/stage-2-resources'
import stage3Resources from '../general/resources/data/stage-3-resources'
import stage4Resources from '../general/resources/data/stage-4-resources'
import stage5Resources from '../general/resources/data/stage-5-resources'
import stage6Resources from '../general/resources/data/stage-6-resources'

@Component({
  selector: 'dev-editor-resources',
  templateUrl: 'editor-resources.html'
})
export class DevEditorResourcesComponent {
  @Input() set stage(stage:number){
    this.stageNumber=stage
    console.log('stage set',stage)
    this.getResources(stage)
  }

  liveResources:any={}
  liveQuestions:any=[]
  stageNumber:number

  constructor(private db: AngularFirestore, private actions: ProjectActions) {

  }
  save(){
    console.log('live questions',this.liveQuestions)
    let patch:any={}
    patch.questions=this.liveQuestions
    this.db.collection('resources').doc<any>('stage'+this.stageNumber+'Resources').update(patch).then(
      res=>console.log('res',res)
    )
  }

  getResources(stage:number){
    console.log('getting resources',stage)
    this.db.collection('resources').doc<any>('stage'+stage+'Resources').valueChanges().subscribe(
      r=>{
        console.log('r',r)
        this.liveResources=r
        if(r.questions){
          Object.keys(r.questions).forEach(k=>{
            let question = r.questions[k]
            question.$key=k
            this.liveQuestions.push(question)
          })
        }
        console.log('live questions',this.liveQuestions)
      }
    )
  }


  // firstInit(){
  //   // run once to load local files to firebase
  //   console.log('db init')
  //   let allResources = [demoResources, stage1Resources, stage2Resources, stage3Resources, stage4Resources, stage5Resources, stage6Resources]
  //   allResources.forEach(r=>{
  //     this.db.collection('resources').doc('stage'+r.stage+'Resources').set(r)
  //   })
  // }

}
