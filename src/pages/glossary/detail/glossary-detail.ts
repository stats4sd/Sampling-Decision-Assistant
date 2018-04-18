import { Component, ViewChild, OnChanges } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import glossaryMaster from '../../../components/general/glossary/glossaryTerms'

@IonicPage({
  segment: 'glossary/:slug',
  defaultHistory: ['HomePage', 'GlossaryPage']
})
@Component({
  selector: 'page-glossary-detail',
  templateUrl: 'glossary-detail.html',
})
export class GlossaryDetailPage implements OnChanges {

  ngOnChanges(changes){
    console.log('changes',changes)
  }

  activeTerm: any = {}
  @ViewChild(Navbar) navbar: Navbar;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('navParam', navParams.data)
    this.activeTerm = navParams.data.activeTerm ? navParams.data.activeTerm : this._getTerm(navParams.data.slug)
  }

  ionViewDidEnter() {
    this.navbar.backButtonClick = () => this.navCtrl.pop({ animate: false });
  }

  _getTerm(slug) {
    // return term with given slug
    console.log('getting term', slug)
    for (let term of glossaryMaster) {
      if (term.slug.toLowerCase() == slug.toLowerCase()) {
        console.log('term matched', term)
        this.activeTerm = term
        return term
      }
    }
  }

  _renderHtml(definition) {
    let content = document.getElementById('definition')
    content.innerHTML=this.activeTerm.definition
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

}
