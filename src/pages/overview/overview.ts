import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html',
})
export class OverviewPage {
  sections: any = []

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataPrvdr: DataProvider) {
    
    this.sections=[
      {name:"General objectives",icon:"assets/img/icons/objectives.svg", page:"ObjectivesPage",number:1},
      {name:"Indicators",icon:"assets/img/icons/indicators.svg", page:"IndicatorsPage",number:1},
      {name:"Definition of the target population and units of study",icon:"assets/img/icons/population.svg", page:"TargetPopulationPage",number:1},
      {name:"At what level do you need to report these results",icon:"assets/img/icons/reporting.svg", page:"ReportingPage",number:1},
      {name:"Reaching the sampling units",icon:"assets/img/icons/outreach.svg", page:"OutreachPage",number:1},
    ]
    console.log('sections', this.sections)
  }

  goToSection(section){
    this.navCtrl.push(section.page)
  }

 

}
