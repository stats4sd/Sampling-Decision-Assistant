import { Component } from '@angular/core';


@Component({
  selector: 'stage-2',
  templateUrl: 'stage-2.html'
})
export class Stage2Component {

  text: string;

  constructor() {
    console.log('Hello Stage_2Component Component');
    this.text = 'Hello World';
  }

}
