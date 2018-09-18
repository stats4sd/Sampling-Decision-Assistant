import { Component, Input } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { DevActions } from "../../actions/actions";
import { ToastController } from "ionic-angular";

@Component({
  selector: "dev-editor-resources",
  templateUrl: "editor-resources.html"
})
export class DevEditorResourcesComponent {
  @Input()
  set stage(stage: number) {
    this.stageNumber = stage;
    this.getResources(stage);
  }
  allResources: any;
  liveResources: any = {};
  liveQuestions: any = [];
  stageNumber: number;
  status: string = "Ready";

  constructor(
    private db: AngularFirestore,
    private devActions: DevActions,
    private toast: ToastController
  ) {
    this.db
      .collection("resources")
      .valueChanges()
      .subscribe(res => {
        this.allResources = res;
        this.getResources(this.stageNumber);
      });
  }
  save() {
    let patch: any = {};
    let questions = {};
    this.liveQuestions.slice(0).forEach(q => {
      questions[q._key] = q;
    });
    patch.questions = questions;
    this.status = "pending";
    this.db
      .collection("resources")
      .doc<any>("stage" + this.stageNumber + "Resources")
      .set(patch)
      .then(res => {
        this.status = "ready";
        this.devActions.toggleEditMode(false);
        this.toast
          .create({
            message: "Changes saved successfully",
            duration: 2000
          })
          .present();
        let timestamp = Date.now();
        this.db
          .collection("backups")
          .doc<any>("stage" + this.stageNumber + "Resources" + timestamp)
          .set(patch);
      });
  }

  getResources(stage: number) {
    if (this.allResources) {
      let r = this.allResources[stage];
      // this.db.collection('resources').doc<any>().valueChanges().subscribe(
      //   r => {
      this.liveResources = r;
      this.liveQuestions = [];
      if (r.questions) {
        Object.keys(r.questions).forEach((k, i) => {
          let question = r.questions[k];
          question._key = k;
          this.liveQuestions.push(question);
        });
      }
    }
    // )
    // }
  }
  addQuestion() {
    this.liveQuestions.push({
      a: "",
      audio: "",
      q: "",
      relevant: [],
      video: "",
      _key: "Q" + (this.liveQuestions.length + 1)
    });
  }

  deleteQuestion(i) {
    this.liveQuestions.splice(i, 1);
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
