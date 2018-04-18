import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular'
import glossaryMaster from './glossaryTerms'
import { AngularFirestore } from 'angularfire2/firestore';
// import {select} from '@angular-redux/store'
// import {Observable} from 'rxjs/Observable'


@Component({
  selector: 'glossary',
  templateUrl: 'glossary.html'
})
export class GlossaryComponent {
  // allGlossaryTerms: any = glossaryMaster;
  allGlossaryTerms: any = [];
  filteredGlossaryTerms: any;
  allSectionTerms: any;
  modalMode: boolean;
  activeTerm: any;
  _sectionTerms:string[]
  _section:number


  @Input() set sectionTerms(sectionTerms: string[]) {
    this._filterGlossary(sectionTerms)
    this._sectionTerms=sectionTerms
  }
  @Input() set section(sectionNumber: number) {
    // let terms = this.allSectionTerms[sectionNumber]
    // this._filterGlossary(terms)
  }
  @Input('displayMode') displayMode: string;
  @Input() set slug(slug: string) {
    if (slug) {
      if (slug == "_") { this.activeTerm = null }
      else { this.activeTerm = this._getTermObject(slug) }
    }
  }

  constructor(private events: Events, private db:AngularFirestore) {
    this.allSectionTerms = {
      1: ['baseline', 'endline', 'experiments', 'external-validity', 'hypothesis-testing', 'indicator', 'inference', 'internal validity', 'quasi-experiments',
      'representative-sample', 'non-representative-sample'],
      2: [],
      3: [],
      4: ['disaggregate-estimates'],
      5: [],
      6: []
    }
    this.db.collection('glossary').valueChanges().subscribe(
      res=>{
        if(res){
          this.allGlossaryTerms=res
          if(this._sectionTerms){this._filterGlossary(this._sectionTerms)}
        }
      }
    )
  }

  setActiveTerm(term) {
    //  if page mode use hash navigation, otherwise embedded component mode
    this.activeTerm = term
    if (this.displayMode == "page") {
      this.events.publish('glossaryTerm:set', this.activeTerm)
    }
  }
  viewAllTerms() {
    this.filteredGlossaryTerms = null;
    this.activeTerm = null;
  }

  _filterGlossary(termsArray) {
    // takes array of glossary slugs and filters all glossary terms to return only those matching
    this.filteredGlossaryTerms = this.allGlossaryTerms.filter(t => {
      return (termsArray.indexOf(t.slug) > -1)
    })
  }

  _getTermObject(term: string) {
    // lookup item from all terms array and return matched by slug (return first instance found)
    let slug = term.toLowerCase().replace(' ', '-')
    return this.allGlossaryTerms.find(t => {
      return t.slug == term ? true : false
    })
  }
  _renderHtml(definition) {
    let content = document.getElementById('definition')
    content.innerHTML = this.activeTerm.definition
    let links = Array.prototype.slice.call(content.querySelectorAll('a'));
    for (let link of links) {
      link.onclick = function (e) {
        this._linkClick(link.href, link.text, e)
      }.bind(this)
    }
  }


}
