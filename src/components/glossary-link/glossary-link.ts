import { Component, Input } from '@angular/core';

@Component({
  selector: 'glossary-link',
  templateUrl: 'glossary-link.html'
})
export class GlossaryLinkComponent {

  @Input('text') text:string;
  @Input('tooltip') tooltip:string;


  constructor() {
    
  }

}
