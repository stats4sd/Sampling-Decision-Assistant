import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'introduction-text',
  templateUrl: 'introduction-text.html'
})
export class IntroductionTextComponent {

  constructor(private viewCtrl:ViewController) {  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
