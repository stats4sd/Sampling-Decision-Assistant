import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProvider} from '../../providers/user/user'


@IonicPage()
@Component({
  selector: 'page-decisions',
  templateUrl: 'decisions.html',
})
export class DecisionsPage {
  decisions:any=[
    {text:"What indicators will guide your sampling decisions?",page:"IndicatorsPage",complete:false},
    {text:"At what level do you need to report your results?",page:"LevelPage",complete:false, disabled:true},
    {text:'What do we need to sample? - “Sampling Units”',page:"SamplingUnitsPage",complete:false, disabled:true},
    {text:'What is a “Target Population”',page:"TargetPopulationPage",complete:false, disabled:true},
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, public user:UserProvider) {
  }

  loadDecision(decision){
    this.navCtrl.push(decision.page)
  }

}
