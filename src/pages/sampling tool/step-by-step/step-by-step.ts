import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, PopoverController } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data'
import { FormProvider } from '../../../providers/form/form'
import { Popover } from 'ionic-angular/components/popover/popover';
import {DecisionToolMenuComponent} from '../../../components/decision-tool-menu/decision-tool-menu'

@IonicPage()
@Component({
  selector: 'page-step-by-step',
  templateUrl: 'step-by-step.html',
})
export class StepByStepPage {
  sections: any = [];
  showIntro:boolean;
  activeSurvey:any

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private dataPrvdr: DataProvider,
    public modalCtrl:ModalController,
    public events:Events,
    public formPrvdr:FormProvider,
    public popoverCtrl:PopoverController,
  ) {
    
    this.sections=[
      {name:"General objectives",icon:"assets/img/icons/objectives.svg", stage:1},
      {name:"Indicators",icon:"assets/img/icons/indicators.svg", stage:2},
      {name:"Definition of the target population and units of study",icon:"assets/img/icons/population.svg", stage:3},
      {name:"At what level do you need to report these results",icon:"assets/img/icons/reporting.svg", stage:4},
      {name:"Selecting the sampling units",icon:"assets/img/icons/outreach.svg", stage:5},
      {name:"Allocating and deploying resources",icon:"assets/img/icons/allocate.svg", stage:6},
    ]
    this.events.subscribe('project:loaded',data=>this.showIntro=false)
    if(this.navParams.data=="tutorialMode"){this.showIntro=true}
  }
  ionViewDidEnter(){
    if(!this.showIntro){
      this.dataPrvdr.saveSurvey()
      this.activeSurvey=this.dataPrvdr.activeSurvey
    }
  }

  goToSection(section){
    if(section.class!="disabled"){
      this.navCtrl.push('StagePage',{stageID:'stage-'+section.stage})
    }
  }
  showMenu(e){
      let popover = this.popoverCtrl.create(DecisionToolMenuComponent);
      popover.onDidDismiss(params=>{
        console.log('params',params)
        if(params=="save"){
          if(!this.dataPrvdr.activeSurvey){this.startNew()}
          else{this.save()}        
        }
        if(params == "load"){this.load()}
        if(params == "new"){this.startNew()}
      })
      popover.present({
        ev:e
      });
  }
  startNew(){
    let modal = this.modalCtrl.create('SavedInfoPage',{view:'save'});
    modal.onDidDismiss(data=>{
      if(data){
        this.showIntro=false
        this.activeSurvey=this.dataPrvdr.activeSurvey
      }
    })
    modal.present()
  }
  load(){
    let modal = this.modalCtrl.create('SavedInfoPage',{view:'load'});
    modal.onDidDismiss(data=>{
      console.log('survey loaded',data)
      if(data){
        this.showIntro=false;
        this.activeSurvey=this.dataPrvdr.activeSurvey        
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
