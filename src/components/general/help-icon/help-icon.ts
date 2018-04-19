import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular'
import { ProjectActions, ViewActions } from '../../../actions/actions';
import { CustomRouterProvider } from '../../../providers/router/router';

@Component({
  selector: 'help-icon',
  templateUrl: 'help-icon.html'
})
export class HelpIconComponent {

  @Input('relevant') relevant: any;

  constructor(public events: Events, private projectActions: ProjectActions, private customRouter: CustomRouterProvider) { }

  // use hash params to change nav to resources tab and show relevant
  helpClicked() {
    this.customRouter.setHashParams({ 
      tabSection: 'resources', 
      relevant: this.relevant 
    })
    // this.projectActions.setRelevantResources(this.relevant)
  }

}
