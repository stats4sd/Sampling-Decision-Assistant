import { select } from "@angular-redux/store";
import { Component } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs";
import { GlossaryProvider } from "../../../providers/glossary/glossary";
import { CustomRouterProvider } from "../../../providers/router/router";
import { IGlossaryTerm } from "../../../models/models";

@Component({
  selector: "glossary-list",
  templateUrl: "glossary-list.html"
})
export class GlossaryListComponent {
  @select(["view", "params", "activeGlossaryTerm"])
  activeGlossarySlug$: Observable<string>;

  // allGlossaryTerms: any = glossaryMaster;
  allGlossaryTerms: IGlossaryTerm[] = [];
  allGlossaryJson: any = {};
  filteredGlossaryTerms: IGlossaryTerm[];
  allSectionTerms: any;
  // modalMode: boolean;
  activeTerm: IGlossaryTerm;
  _sectionTerms: string[];
  // _section:number

  constructor(
    private db: AngularFirestore,
    private customRouter: CustomRouterProvider,
    private glossaryPrvdr: GlossaryProvider
  ) {
    this.activeGlossarySlug$.subscribe(slug => {
      if (slug) {
        let term = this.allGlossaryJson[slug];
        if (term) {
          this.activeTerm = term;
        } else {
          this.activeTerm = {
            term: slug.split("-").join(" "),
            slug: slug,
            definition: "DEFINITION MISSING - " + slug
          };
        }
      }
      console.log("active term", this.activeTerm);
    });

    const ref = this.db.collection("glossary").valueChanges() as Observable<
      IGlossaryTerm[]
    >;
    ref.subscribe(res => {
      if (res) {
        this.allGlossaryTerms = res;
        let allGlossaryJson = {};
        this.allGlossaryTerms.forEach(el => {
          allGlossaryJson[el.slug] = el;
        });
        this.allGlossaryJson = allGlossaryJson;
        // this.projectActions.setMeta({
        //   _allGlossaryTerms:this.allGlossaryTerms
        // })
        if (this._sectionTerms) {
          this._filterGlossary(this._sectionTerms);
        }
      }
    });
  }

  setActiveTerm(term: IGlossaryTerm) {
    this.customRouter.updateHashParams({
      activeGlossaryTerm: term.slug
    });
  }

  viewAllTerms() {
    this.filteredGlossaryTerms = null;
    this.activeTerm = null;
  }

  _filterGlossary(termsArray) {
    // takes array of glossary slugs and filters all glossary terms to return only those matching
    this.filteredGlossaryTerms = this.allGlossaryTerms.filter(t => {
      return termsArray.indexOf(t.slug) > -1;
    });
  }

  _getTermObject(term: string) {
    // lookup item from all terms array and return matched by slug (return first instance found)
    let slug = term.toLowerCase().replace(" ", "-");
    return this.allGlossaryTerms.find(t => {
      return t.slug == term ? true : false;
    });
  }
  _renderHtml(definition) {
    let content = document.getElementById("definition");
    content.innerHTML = this.activeTerm.definition;
    let links = Array.prototype.slice.call(content.querySelectorAll("a"));
    for (let link of links) {
      link.onclick = function(e) {
        this._linkClick(link.href, link.text, e);
      }.bind(this);
    }
  }
}
