import { Component, Input } from '@angular/core';
import { CustomRouterProvider } from '../../../../providers/router/router';
// import { concat } from 'ngx-file-drop/node_modules/rxjs/operators/concat';

@Component({
  selector: 'glossary-link',
  templateUrl: 'glossary-link.html'
})
export class GlossaryLinkComponent {

  @Input('text') text: string;
  @Input('tooltip') tooltip: string;
  @Input('slug') slug: string


  constructor(private customRouter:CustomRouterProvider) {

  }
  glossaryClick() {
    // update hash for corresponding glossary section, handle transition in parent components
    // let hash = location.hash
    // let arr = hash.split('/')
    // if (arr.indexOf('glossary') == -1) {
    //   // no glossary open, append
    //   location.hash = location.hash + '/glossary/' + this.slug
    // }
    // else {
    //   // replace glossary term
    //   let index = arr.indexOf('glossary')
    //   arr[index + 1] = this.slug
    //   location.hash = arr.join('/')
    // }
  }

}
