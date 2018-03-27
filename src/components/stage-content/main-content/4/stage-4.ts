import { Component } from '@angular/core';
import { StagePage } from '../../../../pages/sampling tool/stage/stage';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'stage-4',
  templateUrl: 'stage-4.html'
})
export class Stage4Component extends StagePage {

  @select(['activeProject','values']) formValues$: Observable<string[]>;


  ngAfterViewInit() {
    // breadcrumb listener
    this.attachBreadcrumbSubscriber()
    // attaching subscriber to all values as array manipulation doesn't seem to register otherwise, not sure why... possibly reducer-related?
    this.formValues$.subscribe(
      v=>{
        if(v && v['q4.2']){
          this.checkRepeatGroups(v['q4.2'])
        }
      }
    )
  }

  // check repeat groups for each reporting level exists and is correctly named
  checkRepeatGroups(levels){

  }


}
