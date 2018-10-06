import { Component, Input } from "@angular/core";
// dev
import { AngularFirestore } from "@angular/fire/firestore";
import { IResourceQuestion } from "../../../../models/models";
import { Subscription } from "rxjs";

@Component({
  selector: "resources-list",
  templateUrl: "resources-list.html"
})
export class ResourcesListComponent {
  @Input()
  set stage(stage: number) {
    this.setResources(this.allResources[stage]);
    this._stage = stage;
  }
  @Input()
  relevant: string;
  _stage: number;
  resources$: Subscription;
  allResources = [];
  questions: IResourceQuestion[] = [];
  relevantQuestions: IResourceQuestion[];

  constructor(private db: AngularFirestore) {
    this.resources$ = this.db
      .collection("resources")
      .valueChanges()
      .subscribe(res => {
        this.allResources = res;
        this.setResources(this.allResources[this._stage]);
      });
  }
  ngOnDestroy(): void {
    this.resources$.unsubscribe();
  }

  // extract questions from stage resources, convert to array and subset to relevant/non if relevant control specified
  setResources(stageResources: any) {
    if (stageResources) {
      let questions = [];
      Object.keys(stageResources.questions).forEach(k => {
        questions.push(stageResources.questions[k]);
      });
      this.questions = questions;
      this.setRelevantQuestions(questions);
    }
  }
  // if relevant question specified push those matching to a new array and remove from full questions list
  setRelevantQuestions(questions: IResourceQuestion[]) {
    if (this.relevant) {
      this.relevantQuestions = [];
      this.questions = questions.filter(q => {
        if (
          q.relevant &&
          this.relevant &&
          q.relevant.indexOf(this.relevant) > -1
        ) {
          this.relevantQuestions.push(q);
          return false;
        } else {
          return true;
        }
      });
    }
  }
}
