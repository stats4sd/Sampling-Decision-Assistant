import { Injectable } from "@angular/core";
import { TERMS } from "./glossaryTerms";
import { IGlossaryTerm } from "../../models/models";
import { AngularFirestore } from "angularfire2/firestore";

interface allGlossaryObj {
  slug?: IGlossaryTerm;
}
@Injectable()
export class GlossaryProvider {
  // allGlossaryArray: IGlossaryTerm[] = TERMS;
  public allGlossary: allGlossaryObj = {};
  initComplete: boolean;
  constructor(private afs: AngularFirestore) {}

  async init() {
    // convert glossary terms array to object for faster term retrieval
    this.allGlossary = await this.getGlossary();
    console.log("glossary ready", this.allGlossary);
    this.initComplete = true;
  }

  // return glossary from live database
  // later should be modified to return from file (replacing methods from resources component)
  async getGlossary() {
    if (this.initComplete) {
      return this.allGlossary;
    } else {
      const snapshot = await this.afs.firestore.collection("glossary").get();
      const terms = {};
      snapshot.forEach(doc => {
        const term: IGlossaryTerm = doc.data() as IGlossaryTerm;
        return (terms[term.slug] = term);
      });
      return terms;
    }
  }
}
