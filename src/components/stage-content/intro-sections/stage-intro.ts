import { Component, Input } from '@angular/core';

@Component({
  selector: 'stage-intro',
  templateUrl: 'stage-intro.html'
})
export class StageIntroComponent {

@Input('stage') stage:number;

  constructor() {

  }

}
