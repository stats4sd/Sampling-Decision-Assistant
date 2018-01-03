import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data'
import { FormProvider } from '../../../providers/form/form'

@IonicPage()
@Component({
  selector: 'page-step-by-step',
  templateUrl: 'step-by-step.html',
})
export class StepByStepPage {
  sections: any = [];
  showIntro:boolean=true

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private dataPrvdr: DataProvider,
    public modalCtrl:ModalController,
    public events:Events,
    public formPrvdr:FormProvider
  ) {
    
    this.sections=[
      {name:"General objectives",icon:"assets/img/icons/objectives.svg", page:"ObjectivesPage",number:1},
      {name:"Indicators",icon:"assets/img/icons/indicators.svg", page:"IndicatorsPage",number:2},
      {name:"Definition of the target population and units of study",icon:"assets/img/icons/population.svg", page:"TargetPopulationPage",number:3},
      {name:"At what level do you need to report these results",icon:"assets/img/icons/reporting.svg", page:"ReportingPage",number:4},
      {name:"Selecting and reaching the sampling units",icon:"assets/img/icons/outreach.svg", page:"OutreachPage",number:5},
    ]
    this.events.subscribe('project:loaded',data=>this.showIntro=false)
  }
  ionViewDidEnter(){
    if(!this.showIntro){
      this.dataPrvdr.saveSurvey()
    }
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
      if(data){
        this.showIntro=false;        
      }
    })
    modal.present()
  }
  save(){
    this.dataPrvdr.saveSurvey()
  }
  pushPage(page){
    console.log('pushing page')
    this.navCtrl.push(page)
  }
  export(){
    this.dataPrvdr.export()
  }


 

}
