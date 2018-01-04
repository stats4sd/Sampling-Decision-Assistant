import { Component } from '@angular/core';
import {ViewController} from 'ionic-angular'

@Component({
  selector: 'decision-tool-menu',
  templateUrl: 'decision-tool-menu.html'
})
export class DecisionToolMenuComponent {

  constructor(public viewCtrl:ViewController) {
    console.log('Hello DecisionToolMenuComponent Component');
    
  }
  dismiss(param){
    this.viewCtrl.dismiss(param)
  }

}
