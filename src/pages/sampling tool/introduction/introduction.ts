import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

/**
 simple placeholder page for introduction component text

 */

@IonicPage(
  {defaultHistory:['HomePage']}
)
@Component({
  selector: 'page-introduction',
  templateUrl: 'introduction.html',
})
export class IntroductionPage {

  constructor() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroductionPage');
  }

}
