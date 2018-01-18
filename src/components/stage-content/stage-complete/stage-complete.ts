import { Component } from '@angular/core';

/**
 * Generated class for the StageCompleteComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'stage-complete',
  templateUrl: 'stage-complete.html'
})
export class StageCompleteComponent {

  text: string;

  constructor() {
    console.log('Hello StageCompleteComponent Component');
    this.text = 'Hello World';
  }

}
