import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";

@Injectable()
export class ResourcesProvider {
  constructor(private afs: AngularFirestore) {}

  // return resources from live database
  // later should be modified to return from file (replacing methods from resources component)
  getStageResources(stage: number) {
    return this.afs.doc(`resources/stage${stage}Resources`).valueChanges();
  }
}
