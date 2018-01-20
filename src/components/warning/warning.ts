import { Component } from '@angular/core';

/**
 * Generated class for the WarningComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'warning',
  templateUrl: 'warning.html'
})
export class WarningComponent {

  text: string;

  constructor() {
    console.log('Hello WarningComponent Component');
    this.text = 'Hello World';
  }

}
