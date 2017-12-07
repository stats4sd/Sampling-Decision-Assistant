import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-step-by-step',
  templateUrl: 'step-by-step.html',
})
export class StepByStepPage {
  sections: any = [];
  showIntro:boolean=true

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataPrvdr: DataProvider, public modalCtrl:ModalController) {
    
    this.sections=[
      {name:"General objectives",icon:"assets/img/icons/objectives.svg", page:"ObjectivesPage",number:1},
      {name:"Indicators",icon:"assets/img/icons/indicators.svg", page:"IndicatorsPage",number:2},
      {name:"Definition of the target population and units of study",icon:"assets/img/icons/population.svg", page:"TargetPopulationPage",number:3},
      {name:"At what level do you need to report these results",icon:"assets/img/icons/reporting.svg", page:"ReportingPage",number:4},
      {name:"Reaching the sampling units",icon:"assets/img/icons/outreach.svg", page:"OutreachPage",number:5, class:'disabled'},
    ]
    console.log('sections', this.sections)
  }
  ionViewDidEnter(){
    console.log('view entered')
    if(!this.showIntro){this.dataPrvdr.saveSurvey()}
  }

  goToSection(section){
    if(section.class!="disabled"){
      this.navCtrl.push(section.page)
    }
    
  }
  startNew(){
    let modal = this.modalCtrl.create('SavedInfoPage',{view:'save'});
    modal.onDidDismiss(data=>{
      if(data){this.showIntro=false}
    })
    modal.present()
  }
  load(){
    let modal = this.modalCtrl.create('SavedInfoPage',{view:'load'});
    modal.onDidDismiss(data=>{
      console.log('survey loaded',data)
      if(data){this.showIntro=false}
    })
    modal.present()
  }
  save(){
    this.dataPrvdr.saveSurvey()
  }


 

}
