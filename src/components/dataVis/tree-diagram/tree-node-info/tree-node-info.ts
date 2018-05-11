import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs'
import { TreeDiagramNode, StageMeta, ReportingLevel } from '../../../../models/models';
import { TreeDiagramActions } from '../../../../actions/actions';

@Component({
    selector: 'tree-node-info',
    templateUrl: 'tree-node-info.html'
})
export class TreeNodeInfoComponent {
    @select(['_treeMeta', 'activeNode']) readonly activeNode$: Observable<TreeDiagramNode>
    @select(['activeProject', 'values', 'samplingStages']) readonly samplingStages$: Observable<StageMeta[]>
    @select(['activeProject', 'values', 'reportingLevels']) readonly reportingLevels$: Observable<ReportingLevel[]>
    @select(['view', 'params', 'stagePart']) readonly stagePart$: Observable<string>;
    activeNode: TreeDiagramNode;
    infoSection: string;
    samplingStages: any[] = [];
    nodeMeta: any = {};
    reportingLevels: any[] = [];
    stageMeta: any[] = [
        { label: 'Stage', var: 'stageNumber' },
        { label: 'Sampling Unit', var: 'name' },
        { label: 'Frame', var: 'q5.3.1' },
        { label: 'Units', var: 'q5.3.3' },
        { label: 'Reporting Level', var: 'q5.3.4.2' },
    ]

    constructor(private treeActions: TreeDiagramActions) {
        this.stagePart$.subscribe(p => this._updateInfoSection(null, p))
        this.samplingStages$.subscribe(s => { if (s) { this.samplingStages = s; this._updateActiveNode(this.activeNode) } })
        this.activeNode$.subscribe(node => this._updateActiveNode(node))
        this.reportingLevels$.subscribe(l => { if (l) { this.reportingLevels = l; this._updateActiveNode(this.activeNode) } })

    }

    // set the active node and get meta information depending on node type
    _updateActiveNode(node: TreeDiagramNode) {
        this.activeNode = node
        if (node) {
            console.log('updating active node', node.id)
            let nodeText: any = {}
            let stageMeta: any = {}
            if (node) {
                stageMeta = this._getStageMeta(node.title.length)
            }
            this.nodeMeta = { ...node, stageMeta }
        }

    }

    // return sampling stage values for given stage number
    _getStageMeta(stageNumber: number) {
        let meta = this.samplingStages[stageNumber - 1]
        if (!meta) { meta = {} }
        meta.stageNumber = stageNumber
        return meta
    }

    // update the visible section of the info pane automatically on stage part change or when clicking section tab buttons
    _updateInfoSection(infoSection?: 'info' | 'allocation', stagePart?: string, ) {
        // default info section
        if (!infoSection) { infoSection = 'info' }
        // auto change when part 3 (allocation) selected
        if (stagePart == "3") { infoSection = 'allocation' }
        this.treeActions.setMeta({
            infoSection: infoSection
        })
        this.infoSection = infoSection
        // hide box on first enter
        if (stagePart) { this.treeActions.setActiveNode(null) }

    }

    // convert number to ordinal, e.g. 1->1st, 2->2nd etc.
    _getGetOrdinal(n) {
        var s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
}
