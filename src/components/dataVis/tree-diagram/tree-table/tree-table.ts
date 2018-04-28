import { Component} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable'
import { TreeDiagramNode } from '../../../../models/models';

@Component({
  selector: 'tree-table',
  templateUrl:'tree-table.html'
})
export class TreeTableComponent {
 @select(['_treeMeta','activeNode']) readonly activeNode$:Observable<TreeDiagramNode>
 @select(['activeProject','values','samplingStages']) readonly samplingStages$:Observable<any>
 @select(['activeProject','values','reportingLevels']) readonly reportingLevels$:Observable<any>
 activeNode:TreeDiagramNode

  constructor() {
      this.activeNode$.subscribe(
          node=>this.activeNode=node
      )

  }


}