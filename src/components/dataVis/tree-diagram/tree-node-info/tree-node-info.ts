import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable'
import { TreeDiagramNode } from '../../../../models/models';
import { TreeDiagramActions } from '../../../../actions/actions';

@Component({
    selector: 'tree-node-info',
    templateUrl: 'tree-node-info.html'
})
export class TreeNodeInfoComponent {
    @select(['_treeMeta', 'activeNode']) readonly activeNode$: Observable<TreeDiagramNode>
    @select(['activeProject', 'values', 'samplingStages']) readonly samplingStages$: Observable<any>
    @select(['activeProject', 'values', 'reportingLevels']) readonly reportingLevels$: Observable<any>
    @select(['view', 'params', 'stagePart']) readonly stagePart$: Observable<string>;
    activeNode: TreeDiagramNode;
    infoSection: string;
    samplingStages: any[] = [];
    nodeText: any = {}

    constructor(private treeActions: TreeDiagramActions) {
        this.activeNode$.subscribe(node => this._updateActiveNode(node))
        this.stagePart$.subscribe(p => this._updateInfoSection(null, p))
        this.samplingStages$.subscribe(s => { if (s) { this.samplingStages = s } })

    }

    // set the active node and get meta information depending on node type
    _updateActiveNode(node: TreeDiagramNode) {
        this.activeNode = node
        let nodeText: any = {}
        //  *** incomplete, will use later to add more information to the node info pane
        if (node) {
            // console.log('node', node)
            // console.log('stages', this.samplingStages)
            if (node.group == 'stageNodes') {
                nodeText.stageNumber = node.title.length
            }
        }
        this.nodeText = nodeText
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
        console.log('infoSection', infoSection)

    }

    // convert number to ordinal, e.g. 1->1st, 2->2nd etc.
    _getGetOrdinal(n) {
        var s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
}
