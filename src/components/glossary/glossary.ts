import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular'
import glossaryMaster from '../../models/glossaryTerms'


@Component({
  selector: 'glossary',
  templateUrl: 'glossary.html'
})
export class GlossaryComponent {
  allGlossaryTerms: any = glossaryMaster;
  filteredGlossaryTerms: any;
  allSectionTerms:any;
  modalMode: boolean;
  activeTerm: any;

  @Input() set sectionTerms(sectionTerms: string[]) {
    this._filterGlossary(sectionTerms)
  }
  @Input() set section(sectionNumber:number){
    let terms = this.allSectionTerms[sectionNumber]
    console.log('section glossary terms',terms)
    this._filterGlossary(terms)
  }
  @Input('displayMode') displayMode: string;
  @Input() set slug(slug:string){
    console.log('setting slug',slug)
    if(slug){
      if(slug=="_"){this.activeTerm=null}
      else{this.activeTerm = this._getTermObject(slug)}
    }
  }

  constructor(private events: Events) {
    console.log('all glossary terms',this.allGlossaryTerms)
    this.allSectionTerms={
      1:[],
      2:[],
      3:[],
      4:[],
      5:['sampling-unit'],
      6:[]
    }
  }

  setActiveTerm(term) {
    console.log('component setting active term',term)
    //  if page mode use hash navigation, otherwise embedded component mode
    this.activeTerm = term
    console.log('active term',this.activeTerm)
    if (this.displayMode == "page") {
      this.events.publish('glossaryTerm:set', this.activeTerm)
    }
  }
  viewAllTerms(){
    this.filteredGlossaryTerms=null;
    this.activeTerm=null;
  }

  _filterGlossary(termsArray) {
    // takes array of glossary slugs and filters all glossary terms to return only those matching
    this.filteredGlossaryTerms = this.allGlossaryTerms.filter(t => {
      return (termsArray.indexOf(t.slug) > -1)
    })
    console.log('filtered terms', this.filteredGlossaryTerms)
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
    content.innerHTML = this.activeTerm.Definition
    let links = Array.prototype.slice.call(content.querySelectorAll('a'));
    for (let link of links) {
      link.onclick = function (e) {
        this._linkClick(link.href, link.text, e)
      }.bind(this)
    }
  }


}
