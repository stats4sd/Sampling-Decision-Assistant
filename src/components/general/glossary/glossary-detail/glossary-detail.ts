import { Component, Input } from '@angular/core';
import {GlossaryComponent} from '../glossary'

@Component({
  selector: 'glossary-detail',
  templateUrl: 'glossary-detail.html'
})
export class GlossaryDetailComponent extends GlossaryComponent{
  @Input() set term(term:any){
    console.log('detail setting term',term)
    if(term && term.term){
        this._term=term}
  }
  _term:any;

  _renderHtml(definition) {
    if(definition==""){definition="term definition to go here"}
    let content = document.getElementById('definition')
    content.innerHTML=definition
    let links = Array.prototype.slice.call(content.querySelectorAll('a'));
    for (let link of links) {
      link.onclick = function (e) {
        this._linkClick(link.href, link.text, e)
      }.bind(this)
    }
  }

  _linkClick(href){
    if(href.indexOf('#/glossary/')>-1){
      // internal links
      console.log('internal link clicked',href)
      let arr = href.split('/')
      this.activeTerm=this._getTerm(arr[arr.length-1])
    }
  }

  _getTerm(slug) {
    // return term with given slug
    console.log('getting term', slug)
    for (let term of this.allGlossaryTerms) {
      if (term.slug.toLowerCase() == slug.toLowerCase()) {
        console.log('term matched', term)
        this.activeTerm = term
        return term
      }
    }
  }

}
