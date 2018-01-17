import { Component } from '@angular/core';

@Component({
  selector: 'stage-4',
  templateUrl: 'stage-4.html'
})
export class Stage4Component {

  text: string;

  constructor() {
    console.log('Hello Stage_4Component Component');
    this.text = 'Hello World';
  }

}
