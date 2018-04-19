import { Component, Input } from '@angular/core';
import { CustomRouterProvider } from '../../../../providers/router/router';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable'
import { ViewStateParams } from '../../../../models/models';

@Component({
  selector: 'glossary-link',
  templateUrl: 'glossary-link.html'
})
export class GlossaryLinkComponent {

  @Input('text') text: string;
  @Input('tooltip') tooltip: string;
  @Input('slug') slug: string
  @select(['view','params','tabSection']) tabSection$:Observable<string>


  constructor(private customRouter:CustomRouterProvider) {
    // remove glossary term on section change
    this.tabSection$.subscribe(
      section=>{
        if(section && section!='glossary'){
          this.customRouter.removeHashParam('activeGlossaryTerm')
        }
      }
    )
  }

  glossaryClick() {
    this.customRouter.updateHashParams({
      tabSection:'glossary',
      activeGlossaryTerm:this.slug
    })
  }

}
