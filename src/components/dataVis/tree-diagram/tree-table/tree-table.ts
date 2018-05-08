import { Component } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable'
import { TreeDiagramNode } from '../../../../models/models';
import { CalculatorOutputVars } from '../../sample-size-calculator/sample-size-calculator';


@Component({
    selector: 'tree-table',
    templateUrl: 'tree-table.html'
})
export class TreeTableComponent {
    @select(['_treeMeta', 'activeNode']) readonly activeNode$: Observable<TreeDiagramNode>
    @select(['activeProject', 'values', 'samplingStages']) readonly samplingStages$: Observable<any>
    @select(['activeProject', 'values', 'reportingLevels']) readonly reportingLevels$: Observable<any>
    @select(['activeProject', 'values', '_calculatorVars', 'outputs']) readonly calculatorOutputVars$: Observable<CalculatorOutputVars>
    @select(['activeProject', 'values', 'allocation']) readonly allocation$: Observable<any>

    activeNode: TreeDiagramNode
    calculatorOutputs: CalculatorOutputVars = {
        formatted:[]
    }

    constructor() {
        this.activeNode$.subscribe(
            node => {
                this.activeNode = node
            }
        )
        this.calculatorOutputVars$.subscribe(
            vars => { if (vars) { this.calculatorOutputs = vars } }
        )
        this.allocation$.subscribe(
            allocation=>{if(allocation){
                this.calculateTotals(allocation)
            }}
        )

    }

    // calculate total fsu and intermediate for each path through tree diagram
    calculateTotals(allocation){

    }


}