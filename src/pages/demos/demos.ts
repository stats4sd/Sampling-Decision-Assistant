import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-demos',
  templateUrl: 'demos.html',
})
export class DemosPage {
  brightness:any;
  testArray=['item1','item2']

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  changePage(name){
    console.log(name)
    this.navCtrl.push(name)
  }


  buttonClicked(){
    alert(this.brightness)
    this.brightness=72
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad DemosPage');
  }

}
