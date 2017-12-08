import { Component } from '@angular/core';
import { ModalController, Events } from 'ionic-angular';
import { IntroductionTextComponent} from '../introduction-text/introduction-text'

@Component({
  selector: 'introduction',
  templateUrl: 'introduction.html'
})
export class IntroductionComponent {
  showIntro:boolean
  constructor(public modalCtrl:ModalController, public events:Events) {
  }

  startNew(){
    let modal = this.modalCtrl.create('SavedInfoPage',{view:'save'});
    modal.onDidDismiss(data=>{
      if(data){
        this.events.publish('project:loaded',data)
        //this.showIntro=false
      }
    })
    modal.present()
  }
  load(){
    let modal = this.modalCtrl.create('SavedInfoPage',{view:'load'});
    modal.onDidDismiss(data=>{
      console.log('survey loaded',data)
      if(data){
        this.events.publish('project:loaded',data)
        //this.showIntro=false      
      }
    })
    modal.present()
  }
  showIntroText(){
    let modal = this.modalCtrl.create(IntroductionTextComponent);
    modal.present()
  }

}
