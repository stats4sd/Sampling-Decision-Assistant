import { Injectable } from "@angular/core";
import { TERMS } from "./glossaryTerms";
import { IGlossaryTerm } from "../../models/models";

interface allGlossaryObj {
  slug?: IGlossaryTerm;
}
@Injectable()
export class GlossaryProvider {
  allGlossaryArray: IGlossaryTerm[] = TERMS;
  public allGlossary: allGlossaryObj = {};
  constructor() {
    this.init();
  }

  init() {
    // convert glossary terms array to object for faster term retrieval
    this.allGlossaryArray.forEach(term => {
      this.allGlossary[term.slug] = term;
    });
    console.log("all glossary obj", this.allGlossary);
  }
}
