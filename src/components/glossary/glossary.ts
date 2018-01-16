import { Component, Input } from '@angular/core';
import allTerms from '../../models/glossaryTerms'


@Component({
  selector: 'glossary',
  templateUrl: 'glossary.html'
})
export class GlossaryComponent {
  activeTerm: any;
  allTerms = allTerms;
  sectionTerms: any[]

  @Input('sectionTerms') glossaryTerms: string[]
  // use set/get to load full json object when term or terms changed
  @Input()
  set term(term: string) {
    if (term) { 
      console.log('term set',term)
      this.activeTerm = this._getTermObject(term); 
    }
  }
  @Input()
  set terms(terms: string[]) {
    if (terms) {
      this.sectionTerms = terms.map(t => {
        return this._getTermObject(t)
      })
    }
  }

  constructor() {
  }

   setActiveTerm(term) { this.activeTerm = term }

  _getTermObject(term: string) {
    // lookup item from all terms array and return matched by slug (return first instance found)
    let slug = term.toLowerCase().replace(' ', '-')
    return this.allTerms.find(t => {
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
