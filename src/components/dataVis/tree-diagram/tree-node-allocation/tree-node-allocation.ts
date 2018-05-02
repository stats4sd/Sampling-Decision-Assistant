import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TextInput } from 'ionic-angular'
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable'
import { TreeDiagramNode } from '../../../../models/models';
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
    nodeMeta: any = { stageMeta: {} };
    reportingLevels: any[] = [];
    allocationInput: number;
    @ViewChild('allInput') allInput: TextInput

    constructor(private treeActions: TreeDiagramActions, private formPrvdr: FormProvider, private dataPrvdr:DataProvider) {
        // *** could do some tidying as first node select doesn't display properly due to no sampling stage meta yet (hence the additional update call)
        this.samplingStages$.subscribe(s => { if (s) { this.samplingStages = s; this._updateActiveNode(this.activeNode) } })
        this.activeNode$.subscribe(node => this._updateActiveNode(node))
        this.reportingLevels$.subscribe(l => { if (l) { this.reportingLevels = l; this._updateActiveNode(this.activeNode) } })
    }
    setPopAndSampleSize() {
        this.setPopSize(this.allocationInput)
        this.setSampleSize(this.allocationInput)
    }
    setPopSize(size?) {
        const stageNumber = this.nodeMeta.stageMeta.stageNumber
        this.updateStageControl(stageNumber - 1, { popSize: parseInt(size) })
    }
    setSampleSize(size?) {
        const stageNumber = this.nodeMeta.stageMeta.stageNumber
        this.updateStageControl(stageNumber - 1, { sampleSize: parseInt(size) })
    }
    updateStageControl(stageIndex: number, update: any) {
        let allStages = this.formPrvdr.formGroup.controls.samplingStages.value.slice()
        allStages[stageIndex] = Object.assign({}, allStages[stageIndex], update)
        console.log('all stages', allStages)
        this.formPrvdr.formGroup.patchValue({
            samplingStages: allStages
        })
        this.dataPrvdr.backgroundSave()

    }

    setStageTotal() {

    }

    // set the active node and get meta information depending on node type
    _updateActiveNode(node: TreeDiagramNode) {
        this.activeNode = node
        let nodeText: any = {}
        let stageMeta: any = {}
        if (node) {
            stageMeta = this._getStageMeta(node.title.length)
        }
        this.nodeMeta = Object.assign({}, node, { stageMeta: stageMeta })
        console.log('nodeMeta', this.nodeMeta)
        this._focusInput()


    }
    _focusInput() {
        setTimeout(() => {
            if (this.allInput) { this.allInput.setFocus() }
        }, 50);
    }

    // return sampling stage values for given stage number
    _getStageMeta(stageNumber: number) {
        console.log('stageNumber', stageNumber, 'stageNumber-1', stageNumber - 1, 'sampling stages length', this.samplingStages.length)
        let meta = this.samplingStages[stageNumber - 1]
        if (!meta) { meta = {} }
        meta.stageNumber = stageNumber
        return meta
    }


}
