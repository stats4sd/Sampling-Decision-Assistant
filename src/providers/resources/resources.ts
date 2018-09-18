import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { IStageResources } from "../../models/models";

@Injectable()
export class ResourcesProvider {
  initComplete: Boolean = false;
  allResourcesByStage: { [stageId: string]: IStageResources };

  constructor(private afs: AngularFirestore) {}

  async init() {
    // convert glossary terms array to object for faster term retrieval
    this.allResourcesByStage = await this.getAllResources();
    console.log("resources ready", this.allResourcesByStage);
    this.initComplete = true;
  }

  // get all resources from afs collection
  // later should be modified to return from file (replacing methods from resources component)
  async getAllResources() {
    const snapshot = await this.afs.firestore.collection("resources").get();
    const resources = {};
    snapshot.forEach(doc => {
      return (resources[doc.id] = doc.data());
    });
    return resources;
  }

  async getStageResources(stage: number) {
    console.log(`getting stage-${stage}Resources`);
    if (this.initComplete) {
      return this.allResourcesByStage[`stage${stage}Resources`];
    } else {
      // if initialisation not complete try trigger again (duplicate call, but shouldn't impact)
      await this.getAllResources();
      return this.allResourcesByStage[`stage${stage}Resources`];
    }
  }
}
