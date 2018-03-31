import { Component, Input } from '@angular/core';
import { Events} from 'ionic-angular'
import { ProjectActions } from '../../../actions/actions';

@Component({
  selector: 'help-icon',
  templateUrl: 'help-icon.html'
})
export class HelpIconComponent {

@Input('relevant') relevant:any;

  constructor(public events:Events, private actions:ProjectActions) {}

  helpClicked(){
    console.log('clicked',this.relevant)
    this.events.publish('help:clicked',this.relevant)
    this.actions.setRelevantResources(this.relevant)
  }

}
