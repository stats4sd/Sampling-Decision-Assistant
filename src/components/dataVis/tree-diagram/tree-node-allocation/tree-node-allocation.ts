import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TextInput } from 'ionic-angular'
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable'
import { TreeDiagramNode, AppState, ExtendedTreeDiagramNode, StageMeta } from '../../../../models/models';
import { TreeDiagramActions } from '../../../../actions/actions';
import { FormProvider } from '../../../../providers/form/form';
import { DataProvider } from '../../../../providers/data/data';

@Component({
    selector: 'tree-node-allocation',
    templateUrl: 'tree-node-allocation.html'
})
export class TreeNodeAllocationComponent {
    @select(['_treeMeta', 'activeNode']) readonly activeNode$: Observable<TreeDiagramNode>
    @select(['activeProject', 'values', 'samplingStages']) readonly samplingStages$: Observable<any>
    @select(['activeProject', 'values', 'reportingLevels']) readonly reportingLevels$: Observable<any>
    @select(['view', 'params', 'stagePart']) readonly stagePart$: Observable<string>;
    activeNode: TreeDiagramNode;
    infoSection: string;
    samplingStages: any[] = [];
    nodeMeta: ExtendedTreeDiagramNode = { stageMeta: {} };
    reportingLevels: any[] = [];
    reportingInputs: number[] = [];
    popSize: any; //should be number but input bug sometimes makes string
    sampleSize: any; //should be number but input bug sometimes makes string
    stagePart: string;
    @ViewChild('popSizeInput') popSizeInput: TextInput

    constructor(private treeActions: TreeDiagramActions, private formPrvdr: FormProvider, private dataPrvdr: DataProvider, private ngRedux: NgRedux<AppState>) {
        // *** could do some tidying as first node select doesn't display properly due to no sampling stage meta yet (hence the additional update call)
        this.samplingStages$.subscribe(s => { if (s) { this.samplingStages = s; this._updateActiveNode(this.activeNode) } })
        this.activeNode$.subscribe(node => this._updateActiveNode(node))
        this.reportingLevels$.subscribe(l => { if (l) { this.reportingLevels = l; this._updateActiveNode(this.activeNode) } })
        this.stagePart$.subscribe(part => this.stagePart = part)
    }
    setPopAndSampleSize() {
        const size = parseInt(this.popSize)
        const stageNumber = this.nodeMeta.stageMeta.stageNumber
        this.updateStageControl(stageNumber - 1, { popSize: size, sampleSize: size })
    }
    setPopSize() {
        const size = parseInt(this.popSize)
        const stageNumber = this.nodeMeta.stageMeta.stageNumber
        this.updateStageControl(stageNumber - 1, { popSize: size })
    }
    setSampleSize() {
        const size = parseInt(this.sampleSize)
        const stageNumber = this.nodeMeta.stageMeta.stageNumber
        this.updateStageControl(stageNumber - 1, { sampleSize: size })
    }
    setReportingInput() {
        const stageNumber = this.nodeMeta.stageMeta.stageNumber
        this.updateStageControl(stageNumber - 1, { reportingAllocations: this.reportingInputs })
    }
    updateStageControl(stageIndex: number, update: any) {
        let allStages = this.formPrvdr.formGroup.controls.samplingStages.value.slice()
        allStages[stageIndex] = Object.assign({}, allStages[stageIndex], update)
        this.formPrvdr.formGroup.patchValue({
            samplingStages: allStages
        })
        this.dataPrvdr.backgroundSave()
    }

    // set the active node and get meta information depending on node type
    _updateActiveNode(node: TreeDiagramNode) {
        this.activeNode = node
        let nodeText: any = {}
        let stageMeta: StageMeta = {}
        let reportingMeta: any = {}
        if (node) {
            stageMeta = this._getStageMeta(node.title.length)
            reportingMeta = this._getReportingMeta(stageMeta.stageNumber, node.title)
        }
        this.nodeMeta = Object.assign({}, node, { stageMeta: stageMeta, reportingMeta: reportingMeta })
        // update input values
        this.popSize = stageMeta.popSize
        this.sampleSize = stageMeta.sampleSize
        if (stageMeta.reportingAllocations) {
            this.reportingInputs = stageMeta.reportingAllocations
        }
        else { this.reportingInputs = [] }
        //console.log('nodeMeta', this.nodeMeta)
        this._focusInput()
    }

    _focusInput() {
        setTimeout(() => {
            if (this.popSizeInput) { this.popSizeInput.setFocus() }
        }, 50);
    }

    // return sampling stage values and reporting levels for given stage number
    _getStageMeta(stageNumber: number) {
        let meta = this.samplingStages[stageNumber - 1]
        if (!meta) { meta = {} }
        meta.stageNumber = stageNumber
        return meta
    }

    // iterate over all nodes, matching reporting nodes by their title metadata
    // titles given as array of strings, can determine parent by taking active node title (e.g. "[stage1,stage2|-|0|-|Group A"])
    // and removing everything from '|-|' onwards
    _getReportingMeta(stageNumber: number, activeNodePath: string[]) {
        try {
            let nodes = this.ngRedux.getState()._treeMeta.nodes
            const path = activeNodePath.slice()
            console.log('path',path)
            // const parentPath = activeNodePath.slice().splice(-1, 1, parentPathSuffix).join()
            //console.log('filtering nodes', nodes)
            // console.log('target path', parentPath)
            // nodes = nodes.filter(n => {
            //     const suffix = n.title.slice().pop().split('|-|')[0]
            //     const path = n.title.splice(-1,1,suffix).join()
            //     return (n.group == 'reportingLevelNodes' && path==parentPath)
            // })
            return nodes
        } catch (error) {
            console.log('error')
        }

    }


}


