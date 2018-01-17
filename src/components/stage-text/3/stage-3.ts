import { Component } from '@angular/core';

@Component({
  selector: 'stage-3',
  templateUrl: 'stage-3.html'
})
export class Stage3Component {

  text: string;

  constructor() {
    console.log('Hello Stage_3Component Component');
    this.text = 'Hello World';
  }

}
