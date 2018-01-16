import { Component } from '@angular/core';

@Component({
  selector: 'stage-5',
  templateUrl: 'stage-5.html'
})
export class Stage5Component {

  text: string;

  constructor() {
    console.log('Hello Stage_5Component Component');
    this.text = 'Hello World';
  }

}
