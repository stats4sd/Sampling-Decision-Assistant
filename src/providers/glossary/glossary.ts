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
  constructor(private afs: AngularFirestore) {
    this.init();
  }

  async init() {
    // convert glossary terms array to object for faster term retrieval
    const allGlossaryArray = await this.getGlossary();
    allGlossaryArray.forEach(term => {
      this.allGlossary[term.slug] = term;
    });
    console.log("all glossary obj", this.allGlossary);
    this.initComplete = true;
  }

  // return glossary from live database
  // later should be modified to return from file (replacing methods from resources component)
  async getGlossary() {
    const snapshot = await this.afs.firestore.collection("glossary").get();
    const terms = [];
    snapshot.forEach(doc => {
      return terms.push(doc.data());
    });
    return terms;
  }
}
