import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, NavController, Events } from 'ionic-angular';
import glossaryMaster from '../../models/glossaryTerms'

@IonicPage({
  segment: 'glossary',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-glossary',
  templateUrl: 'glossary.html',
})
export class GlossaryPage {
  glossaryTerms: any = glossaryMaster;
  modalMode: boolean;
  activeTerm: any = {}

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public navCtrl: NavController, public events: Events) {
    // if (navParams.data.term) {
    //   this.modalMode = true
    //   this._getActiveTerm(navParams.data.term)
    // }
    this.events.subscribe('glossaryTerm:set', term => this.setActiveTerm(term))
  }





  setActiveTerm(term) {
    console.log('page setting active term', term)
    if (!term.Definition) { term.Definition = "This is just a placeholder definition for " + term.Term + ". More content will be added later" }
    this.activeTerm = term
    this.navCtrl.push('GlossaryDetailPage', {
      slug: this.activeTerm.slug,
      activeTerm: this.activeTerm
    }, { animate: false })
  }

}

   // showFullGlossary() {
  //   this.activeTerm = {}
  // }

  // dismiss() {
  //   this.viewCtrl.dismiss()
  // }

  // _getActiveTerm(term:string) {
  //   // get term from glossary and set as active
  //   let slug = term.toLowerCase().replace(' ','-')
  //   this.glossaryTerms.forEach(el => {
  //     if (el.slug == slug) {
  //       this.activeTerm = el
  //       return "success"
  //     }
  //     return "fail"
  //   });
  // }



  // _setupClickHandlers() {
  //   // handle link and image clicks to not follow href (opening external)
  //   let content = document.getElementById('definition')
  //   let images = Array.prototype.slice.call(content.querySelectorAll('img'));
  //   for (let image of images) {
  //     image.onclick = function (e) {
  //       event.preventDefault()
  //       this.imageClick(image.src, e.target)
  //     }.bind(this)
  //   }
  //}

  // _linkClick(href,text,e){
  //   // not great way to test if local link or external
  //   // better if just follow hyperlink and bind deeplinking structure to page
  //   console.log('link',href)
  //   console.log('location',window.location)
  //   if(href.indexOf(window.location.origin)>-1){
  //     event.preventDefault()
  //     this._getActiveTerm(text)
  //   }
  // }





