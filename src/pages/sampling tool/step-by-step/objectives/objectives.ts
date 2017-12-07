import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DataProvider } from '../../../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-objectives',
  templateUrl: 'objectives.html',
})
export class ObjectivesPage {
  sectionMeta: any = {}


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataPrvdr: DataProvider, private modalCtrl: ModalController) {
    this.sectionMeta=this.dataPrvdr.getSectionMeta("General objectives")
    console.log('sectionMeta',this.sectionMeta)
  }
  ionViewDidEnter(){
    
    
  }

  showGlossary(term: string) {
    term = term.toLowerCase()
    let modal = this.modalCtrl.create("GlossaryPage", { term: term });
    modal.present();
  }

}
