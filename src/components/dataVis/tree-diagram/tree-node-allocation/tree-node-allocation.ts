import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TextInput, Events } from 'ionic-angular'
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable'
import { TreeDiagramNode, AppState, ExtendedTreeDiagramNode, StageMeta } from '../../../../models/models';
import { TreeDiagramActions } from '../../../../actions/actions';
import { FormProvider } from '../../../../providers/form/form';
import { DataProvider } from '../../../../providers/data/data';
import { TreeDiagramComponent } from '../tree-diagram';

@Component({
    selector: 'tree-node-allocation',
    templateUrl: 'tree-node-allocation.html'
})
export class TreeNodeAllocationComponent extends TreeDiagramComponent {
    @select(['_treeMeta', 'activeNode']) readonly activeNode$: Observable<TreeDiagramNode>
    @select(['activeProject', 'values', 'samplingStages']) readonly samplingStages$: Observable<any>
    @select(['activeProject', 'values', 'reportingLevels']) readonly reportingLevels$: Observable<any>
    @select(['view', 'params', 'stagePart']) readonly stagePart$: Observable<string>;
    nodes: any;
    activeNode: TreeDiagramNode;
    infoSection: string;
    samplingStages: any[] = [];
    nodeMeta: ExtendedTreeDiagramNode = { stageMeta: {} };
    reportingLevels: any[] = [];
    reportingInputs: number[] = [];
    popSize: any; //should be number but input bug sometimes makes string
    sampleSize: any; //should be number but input bug sometimes makes string
    stagePart: string;
    allocationMeta: AllocationMeta = {} // controls which type of allocation view to show, e.g. sampleStage, finalStage, reportingLevel
    @ViewChild('popSizeInput') popSizeInput: TextInput

    constructor() {
        super()
    }
    ngOnInit() {
        // *** could do some tidying as first node select doesn't display properly due to no sampling stage meta yet (hence the additional update call)
        this.samplingStages$.subscribe(s => { if (s) { this.samplingStages = s; this.setActiveNode(this.activeNode) } })
        this.activeNode$.debounceTime(200).subscribe(node => this.setActiveNode(node))
        this.reportingLevels$.subscribe(l => { if (l) { this.reportingLevels = l; this.setActiveNode(this.activeNode) } })
        this.stagePart$.subscribe(part => this.stagePart = part)
    }




    setPopAndSampleSize() {
        const size = parseInt(this.popSize)
        const stageNumber = this.nodeMeta.stageMeta.stageNumber
        this.updateStageControl(stageNumber - 1, { popSize: size, sampleSize: size })
        this.updateNodeLabel(size)
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
        this.updateNodeLabel(size)
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

    updateNodeLabel(size: number) {
        const node = this.activeNode
        let path = node.title
        let pathEnd = path[path.length - 1]
        let split = pathEnd.split('_._')
        let label = split[split.length - 1]
        if (node.group == "stageNodes") {
            label = label + '\n (' + size + ')'
        }

        this.activeNode.label = label
        this.events.publish('node:updated', this.activeNode)
    }



    // set the active node and get meta information depending on node type
    setActiveNode(node: TreeDiagramNode) {
        this.activeNode = node
        if (node && node.id) {
            let nodeText: any = {}
            let stageMeta: StageMeta = {}
            let reportingMeta: any = {}

            stageMeta = this._getStageMeta(node.title.length)
            reportingMeta = this._getReportingMeta(node)

            this.nodeMeta = Object.assign({}, node, { stageMeta: stageMeta, reportingMeta: reportingMeta })
            // update input values
            this.updateInputValues(stageMeta)
            this.setAllocationType()
        }

    }
    // track important allocation type meta that will alter inputs available (e.g. whether final stage, penultimate stage, SRS/PPS etc.)
    setAllocationType() {
        let n = this.nodeMeta
        const stage = n.title.length
        const totalStages = this.samplingStages.length
        let allocation: AllocationMeta = {}
        if (totalStages - stage == 0) { allocation.isFinalStage = true }
        if (totalStages - stage == 1) { allocation.isPenultimateStage = true }
        if (n.group == 'stageNodes') { allocation.type = "stage" }
        if (n.group == 'reportingLevelNodes') { allocation.type = "reportingLevel" }
        if (n.stageMeta["q5.3.4.2"] instanceof Array) { allocation.hasReportingLevels = true }
        if (n.stageMeta["q5.3.3"] == 'Sample') { allocation.sampleTake = 'Sample' }
        if (n.stageMeta["q5.3.3"] == 'All') { allocation.sampleTake = 'All' }
        if (n.stageMeta["q5.3.4.3"] == 'Simple random sampling') { allocation.samplingStrategy = 'SRS' }
        if (n.stageMeta["q5.3.4.3"] == 'Probability proportional to size') { allocation.samplingStrategy = 'PPS' }
        console.log('node meta', this.nodeMeta)
        this.allocationMeta = allocation
        console.log('allocation meta', this.allocationMeta)
    }
    updateInputValues(stageMeta: StageMeta) {
        this.popSize = stageMeta.popSize
        this.sampleSize = stageMeta.sampleSize
        if (stageMeta.reportingAllocations) {
            this.reportingInputs = stageMeta.reportingAllocations
        }
        else { this.reportingInputs = [] }
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
            // ignore error when empty node selected
        }

    }


    updateFinalStageSize(size: number) {
        if (size) {
            try {
                const samplingStages = this.ngRedux.getState().activeProject.values.samplingStages
                const finalStage: StageMeta = samplingStages[samplingStages.length - 1]
                console.log('final stage', finalStage)
                let nodes
                // update final reporting level nodes and final stage
                if (finalStage["q5.3.4.2"] instanceof Array) {
                    nodes = this.nodes.filter(n => {
                        return (n.group == 'reportingLevelNodes' && n.id.indexOf('_._') > -1 && n.nodePath.length == samplingStages.length)
                    })
                    nodes.forEach(n => {

                    })
                    size = size * (nodes.length / samplingStages.length)
                }
                // update final stage nodes

                nodes = this.nodes.filter(n => {
                    return (n.group == 'stageNodes' && n.nodePath.length == samplingStages.length)
                })
                nodes.forEach(n => {

                })
                console.log('final nodes', nodes)
            } catch (error) {

            }

        }
    }


}

interface AllocationMeta {
    type?: string,
    isFinalStage?: boolean,
    isPenultimateStage?: boolean,
    hasReportingLevels?: boolean,
    sampleTake?: 'All' | 'Sample',
    samplingStrategy?: 'SRS' | 'PPS'
}

// var defaultAllocationMeta = {
//     type: null,
//     isFinalStage: null,
//     isPenultimateStage: null,
//     hasReportingLevels: null,
//     sampleTake: null,
//     samplingStrategy: null
// }

