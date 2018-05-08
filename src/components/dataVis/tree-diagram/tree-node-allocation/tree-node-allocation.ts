import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TextInput, Events } from 'ionic-angular'
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable'
import { TreeDiagramNode, AppState, ExtendedTreeDiagramNode, StageMeta, TreeNodeAllocation } from '../../../../models/models';
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
    @select(['activeProject', 'values', 'allocation']) readonly allocation$: Observable<any>
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
    allocation: any = {};
    allocationControlChecked: boolean;
    @ViewChild('popSizeInput') popSizeInput: TextInput

    constructor(
        private treeActions: TreeDiagramActions,
        private formPrvdr: FormProvider,
        private dataPrvdr: DataProvider,
        private ngRedux: NgRedux<AppState>,
        private events: Events
    ) {
        // *** could do some tidying as first node select doesn't display properly due to no sampling stage meta yet (hence the additional update call)
        this.samplingStages$.subscribe(s => { if (s) { this.samplingStages = s; this.setActiveNode(this.activeNode) } })
        this.activeNode$.subscribe(node => this.setActiveNode(node))
        this.reportingLevels$.subscribe(l => { if (l) { this.reportingLevels = l; this.setActiveNode(this.activeNode) } })
        this.stagePart$.subscribe(part => { this.stagePart = part })
        this.allocation$.subscribe(allocation => this.allocation = allocation)
    }




    setPopAndSampleSize() {
        const size = parseInt(this.popSize)
        const stageNumber = this.nodeMeta.stageMeta.stageNumber

        this.allocate(this.activeNode.id, { popSize: size, sampleSize: size })
        this.updateNodeLabel(size)
    }
    setPopSize() {
        const size = parseInt(this.popSize)
        const stageNumber = this.nodeMeta.stageMeta.stageNumber
        // this.updateStageControl(stageNumber - 1, { popSize: size })
        this.allocate(this.activeNode.id, { popSize: size })
    }
    setSampleSize() {
        const size = parseInt(this.sampleSize)
        const stageNumber = this.nodeMeta.stageMeta.stageNumber
        // this.updateStageControl(stageNumber - 1, { sampleSize: size })
        this.allocate(this.activeNode.id, { sampleSize: size })
        this.updateNodeLabel(size)
    }
    setReportingInput() {
        const stageNumber = this.nodeMeta.stageMeta.stageNumber
        // this.updateStageControl(stageNumber - 1, { reportingAllocations: this.reportingInputs })
    }

    // refelct all allocation changes to formgroup
    allocate(nodeID: string, values: TreeNodeAllocation) {
        if (!this.allocationControlChecked) { this._checkAllocationControl() }
        this.allocation[nodeID] = values
        this.formPrvdr.formGroup.patchValue({ allocation: this.allocation })
        this.dataPrvdr.backgroundSave()
        this.updateNodeLabel(values.sampleSize)
    }

    // add form control for values.allocation if doesn't already exist
    _checkAllocationControl() {
        if (!this.formPrvdr.formGroup.controls.allocation) {
            this.formPrvdr.formGroup.addControl('allocation', this.formPrvdr.fb.control({}))
        }
        this.allocationControlChecked = true
    }

    updateNodeLabel(size: number) {
        let label = this.activeNode.label
        label = label.split(' (')[0]
        if (size) {
            label = label + ' (' + size + ')'
        }
        this.activeNode.label = label
        this.events.publish('node:updated', this.activeNode)
    }

    // set the active node and get meta information depending on node type
    setActiveNode(node: TreeDiagramNode) {
        this.activeNode = node
        let nodeText: any = {}
        let stageMeta: StageMeta = {}
        let reportingMeta: any = {}
        if (node) {
            stageMeta = this._getStageMeta(node.title.length)
            reportingMeta = this._getReportingMeta(node)
            // assign allocation size if set
            try {
                const allocation: TreeNodeAllocation = this.ngRedux.getState().activeProject.values.allocation[node.id]
                this.popSize = allocation.popSize
                this.sampleSize = allocation.sampleSize
            } catch (error) {
                this.popSize = null
                this.sampleSize = null
            }
        }
        this.nodeMeta = Object.assign({}, node, { stageMeta: stageMeta, reportingMeta: reportingMeta })
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
    _getReportingMeta(node: TreeDiagramNode) {
        try {
            let nodes = this.ngRedux.getState()._treeMeta.nodes
            let nodePath = node.id.split('/')
            let parentPath = nodePath.slice(0, nodePath.length - 1)
            let parentID = parentPath.join('/')
            // match nodes with same parent, same stage and reporting level
            nodes = nodes.filter(n => {
                return (n.id.indexOf(parentID) > -1 && n.title.length == node.title.length && n.group == 'reportingLevelNodes')
            })
            return nodes
        } catch (error) {
            //console.log('error')
        }

    }

    //  // this.updateStageControl(stageNumber - 1, { popSize: size, sampleSize: size })

    // updateStageControl(stageIndex: number, update: any) {
    //     let allStages = this.formPrvdr.formGroup.controls.samplingStages.value.slice()
    //     allStages[stageIndex] = Object.assign({}, allStages[stageIndex], update)
    //     this.formPrvdr.formGroup.patchValue({
    //         samplingStages: allStages
    //     })
    //     this.dataPrvdr.backgroundSave()
    // }



}


