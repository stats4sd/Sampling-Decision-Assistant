import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  imageSrc="assets/img/feature-image-1.jpg"
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController) {

  }


  ionViewDidLoad(){
    // prevent user swiping
    this.slides.lockSwipes(true)
  }
  nextSlide(){
    this.slides.lockSwipes(false)
    this.slides.slideNext()
    this.slides.lockSwipes(true)
  }
  startNew(){
    this.navCtrl.push('OverviewPage')
  }

}
