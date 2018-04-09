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
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'dev-editor-resources',
  templateUrl: 'editor-resources.html'
})
export class DevEditorResourcesComponent {
  @Input() set stage(stage: number) {
    this.stageNumber = stage
    this.getResources(stage)
  }
  allResources: any
  liveResources: any = {}
  liveQuestions: any = []
  stageNumber: number;
  status: string = 'Ready'

  constructor(private db: AngularFirestore, private actions: ProjectActions, private toast: ToastController) {
    //this.firstInit()
    this.db.collection('resources').valueChanges().subscribe(
      res => {
        this.allResources = res;
        this.getResources(this.stageNumber)
      })
  }
  save() {
    console.log('live questions', this.liveQuestions)
    let patch: any = {}
    let questions = {}
    this.liveQuestions.slice(0).forEach(q => {
      questions[q._key] = q
    })
    patch.questions = questions
    this.status = 'pending'
    this.db.collection('resources').doc<any>('stage' + this.stageNumber + 'Resources').set(patch).then(
      res => {
        console.log('res', res)
        this.status = 'ready'
        this.actions.toggleEditMode(false)
        this.toast.create({
          message: 'Changes saved successfully'
        }).present()
        let timestamp = Date.now()
        this.db.collection('backups').doc<any>('stage' + this.stageNumber + 'Resources'+timestamp).set(patch)
      }
    )
  }

  getResources(stage: number) {
    if (this.allResources) {
      console.log('all resources', this.allResources)
      let r = this.allResources[stage]
      console.log('getting resources', stage)
      // this.db.collection('resources').doc<any>().valueChanges().subscribe(
      //   r => {
      console.log('r', r)
      this.liveResources = r
      this.liveQuestions=[]
      if (r.questions) {
        Object.keys(r.questions).forEach((k, i) => {
          let question = r.questions[k]
          question._key = k
          this.liveQuestions.push(question)
        })
      }
      console.log('live questions', this.liveQuestions)
    }
    // )
    // }

  }
  addQuestion() {
    console.log('adding question')
    this.liveQuestions.push({
      a: "",
      audio:"",
      q:"",
      relevant:[],
      video:"",
      _key:'Q'+(this.liveQuestions.length+1)
    })
    console.log('liveQuestions',this.liveQuestions)
  }
  
  deleteQuestion(i){
    this.liveQuestions.splice(i,1)
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
