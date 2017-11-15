import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
// declare let player

@IonicPage()
@Component({
  selector: 'page-dev',
  templateUrl: 'dev.html',
})
export class DevPage {
  storylinePlayer: any;
  test1Complete:boolean;
  test2Complete:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public toast: ToastController) {
    this.setupListener()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevPage');
    console.log('origin', window.location.origin)

  }

  /* Testing storyline integration
   Example code and notes can be found here:
   http://www.rabbitoreg.com/2016/11/05/javascript-storyline-two-way-communication-via-iframe/

   More methods and such:
   https://articulate.com/support/article/Storyline-3-JavaScript-Best-Practices-and-Examples
   */

  getPlayer() {
    // note can only be called after player fully loaded
    let storylineEl = window.frames[0].frameElement.contentWindow
    this.storylinePlayer = storylineEl.GetPlayer()
    console.log('storylinePlayer', this.storylinePlayer)

  }
  updateName() {
    if (!this.storylinePlayer) { this.getPlayer() }
    this.storylinePlayer.SetVar('userName', 'Chris')
    console.log('confirmation', this.storylinePlayer.GetVar('userName'))
    this.test1Complete=true;
  }
  changeSlide() {
    if (!this.storylinePlayer) { this.getPlayer() }
    this.storylinePlayer.SetVar('activeSlide', 2)
    this.test2Complete=true
  }

  messageReceived(msg) {
    if(msg==""){msg = "You didn't type anything!"}
    console.log('message received', msg)
    let toast = this.toast.create({
      message:'received! : '+msg,
      duration: 3000
    })
    toast.present();
  }

  /*
  Note, more communication could be add to attach event listener to player but probably not necessary
  example here: 
  https://community.articulate.com/discussions/building-better-courses/communication-between-storyline-and-3rd-party-content
  */

  setupListener() {
    var eventMethod = window.addEventListener
      ? "addEventListener"
      : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod === "attachEvent"
      ? "onmessage"
      : "message";
    eventer(messageEvent, e=>this.messageReceived(e.data))
  }

}
