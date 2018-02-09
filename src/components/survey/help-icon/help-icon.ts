import { Component, Input } from '@angular/core';
import { Events} from 'ionic-angular'

@Component({
  selector: 'help-icon',
  templateUrl: 'help-icon.html'
})
export class HelpIconComponent {

@Input('relevant') relevant:any;

  constructor(public events:Events) {}

  helpClicked(){
    this.events.publish('help:clicked',this.relevant)
  }

}