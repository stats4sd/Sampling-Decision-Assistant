import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import glossaryMaster from '../../models/glossaryTerms'

@IonicPage()
@Component({
  selector: 'page-glossary',
  templateUrl: 'glossary.html',
})
export class GlossaryPage {
  glossaryTerms:any=glossaryMaster;
  modalMode:boolean;
  activeTerm:any;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    if(navParams.data.term){
      this.modalMode=true
      this._getActiveTerm(navParams.data.term)
    }
  }

  dismiss(){
    this.viewCtrl.dismiss()
  }

  showFullGlossary(){
    this.activeTerm=null
  }

  setActiveTerm(term){
    console.log('setting active term',term)
    if(!term.Definition){term.Definition="This is just a placeholder definition for "+term.Term+". More content will be added later"}
    this.activeTerm=term
  }
  
  _getActiveTerm(term){
    // get term from glossary and set as active
    this.glossaryTerms.forEach(el => {
      if(el.Term==term){
        this.activeTerm=el
        return
      }
    });
  }

  

}
