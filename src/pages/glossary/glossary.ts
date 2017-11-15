import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import glossaryMaster from '../../models/glossaryTerms'

@IonicPage()
@Component({
  selector: 'page-glossary',
  templateUrl: 'glossary.html',
})
export class GlossaryPage {
  glossaryTerms:any=glossaryMaster;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

}
