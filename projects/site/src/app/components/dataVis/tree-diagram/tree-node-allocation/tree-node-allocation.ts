import { Component, ViewChild } from "@angular/core";
import { Events } from "@ionic/angular";
import { select, NgRedux } from "@angular-redux/store";
import { Observable, Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import {
  TreeDiagramNode,
  AppState,
  ExtendedTreeDiagramNode,
  StageMeta,
  ReportingLevel
} from "../../../../models/models";
import { FormProvider } from "src/app/services/form/form";
import { DataProvider } from "src/app/services/data/data";

@Component({
  selector: "tree-node-allocation",
  templateUrl: "tree-node-allocation.html",
  styleUrls: ["tree-node-allocation.scss"]
})
export class TreeNodeAllocationComponent {
  removeSubscriptions$ = new Subject();
  @select(["_treeMeta", "activeNode"])
  readonly activeNode$: Observable<TreeDiagramNode>;
  @select(["activeProject", "values", "samplingStages"])
  readonly samplingStages$: Observable<StageMeta[]>;
  @select(["activeProject", "values", "reportingLevels"])
  readonly reportingLevels$: Observable<ReportingLevel[]>;
  @select(["activeProject", "values", "allocation"])
  readonly allocation$: Observable<any>;
  @select(["view", "params", "stagePart"])
  readonly stagePart$: Observable<string>;
  @select(["view", "hash"])
  readonly hash$: Observable<string>;
  nodes: any;
  activeNode: TreeDiagramNode;
  infoSection: string;
  samplingStages: any[] = [];
  nodeMeta: ExtendedTreeDiagramNode = { stageMeta: {} };
  reportingLevels: any[] = [];
  reportingInputs: number[] = [];
  sampleSize: any; //should be number but input bug sometimes makes string
  stagePart: string;
  allocationMeta: AllocationMeta = {}; // controls which type of allocation view to show, e.g. sampleStage, finalStage, reportingLevel
  allocation: any = {};
  allocationControlChecked: boolean;
  reviewMode: boolean;
  @ViewChild("sampleSizeInput", { static: false })
  sampleSizeInput: any;

  constructor(
    public formPrvdr: FormProvider,
    public ngRedux: NgRedux<AppState>,
    public dataPrvdr: DataProvider,
    public events: Events
  ) {
    this.samplingStages$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(s => {
        if (s) {
          this.samplingStages = s;
          this.setActiveNode(this.activeNode);
        }
      });
    this.activeNode$
      .pipe(debounceTime(200))
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(node => this.setActiveNode(node));
    this.reportingLevels$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(l => {
        if (l) {
          this.reportingLevels = l;
          this.setActiveNode(this.activeNode);
        }
      });
    this.stagePart$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(part => {
        this.stagePart = part;
      });
    this.allocation$
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(allocation => {
        if (allocation) {
          this.allocation = allocation;
        }
      });
    this.hash$.pipe(takeUntil(this.removeSubscriptions$)).subscribe(hash => {
      this.reviewMode = hash && hash.indexOf("review") > -1 ? true : false;
    });
  }
  ngOnDestroy(): void {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
  }

  setSampleSize() {
    const size = parseInt(this.sampleSize);
    this.allocate(this.activeNode, size);
    // also set child reporting level nodes if appropriate
    if (this.nodeMeta.reportingMeta && this.nodeMeta.reportingMeta.length > 0) {
      this.setReportingAllocations(this.nodeMeta, this.sampleSize);
    }
    // use event subscriber on change as redux can't see sub property changes
    this.events.publish("allocation:updated", this.allocation);
  }
  setReportingAllocations(
    parentNodeMeta: ExtendedTreeDiagramNode,
    parentSampleSize: number
  ) {
    const totalChildNodes = parentNodeMeta.reportingMeta.length;
    const childAllocationSize =
      Math.round((parentSampleSize / totalChildNodes) * 100) / 100;
    parentNodeMeta.reportingMeta.forEach(node => {
      this.allocate(node, childAllocationSize);
    });
  }

  // refelct all allocation changes to formgroup
  allocate(node: TreeDiagramNode, sampleSize: number) {
    const nodeID = node.id;
    if (!this.allocationControlChecked) {
      this._checkAllocationControl();
    }
    if (this.allocation[nodeID] != sampleSize) {
      this.allocation[nodeID] = sampleSize;
      this.formPrvdr.formGroup.patchValue({ allocation: this.allocation });
      this.dataPrvdr.backgroundSave();
      this.updateNodeLabel(node, sampleSize);
    }
  }

  // add form control for values.allocation if doesn't already exist
  _checkAllocationControl() {
    if (!this.formPrvdr.formGroup.controls.allocation) {
      this.formPrvdr.formGroup.addControl(
        "allocation",
        this.formPrvdr.fb.control({})
      );
    }
    this.allocationControlChecked = true;
  }

  updateNodeLabel(node: TreeDiagramNode, size: number) {
    let label = node.label;
    label = label.split(" (")[0];
    if (size) {
      label = label + " (" + size + ")";
    }
    node.label = label;
    this.events.publish("node:updated", node);
  }

  // set the active node and get meta information depending on node type
  setActiveNode(node: TreeDiagramNode = {}) {
    this.activeNode = node;
    if (node && node.id) {
      let stageMeta: StageMeta = {};
      let reportingMeta: any = {};
      stageMeta = this._getStageMeta(node.title.length);
      reportingMeta = this._getReportingMeta(node);
      this.nodeMeta = Object.assign({}, node, {
        stageMeta: stageMeta,
        reportingMeta: reportingMeta
      });
      this.setAllocationType();
      this.setInputValue(node.id);
      this.focusInput();
    }
  }
  // track important allocation type meta that will alter inputs available (e.g. whether final stage, penultimate stage, SRS/PPS etc.)
  setAllocationType() {
    let n = this.nodeMeta;
    const stage = n.title.length;
    const totalStages = this.samplingStages.length;
    let allocation: AllocationMeta = {};
    if (totalStages == 1) {
      allocation.isSingleStage = true;
    }
    if (totalStages - stage == 0) {
      allocation.isFinalStage = true;
    }
    if (totalStages - stage == 1) {
      allocation.isPenultimateStage = true;
    }
    if (n.group == "stageNodes") {
      allocation.type = "stage";
    }
    if (n.group == "reportingLevelNodes") {
      allocation.type = "reportingLevel";
    }
    if (n.stageMeta["q5.3.4.2"] instanceof Array) {
      allocation.hasReportingLevels = true;
    }
    if (n.stageMeta["q5.3.3"] == "Sample") {
      allocation.sampleTake = "Sample";
    }
    if (n.stageMeta["q5.3.3"] == "All") {
      allocation.sampleTake = "All";
    }
    if (n.stageMeta["q5.3.4.3"] == "Simple random sampling") {
      allocation.samplingStrategy = "SRS";
    }
    if (n.stageMeta["q5.3.4.3"] == "Probability proportional to size") {
      allocation.samplingStrategy = "PPS";
    }
    this.allocationMeta = allocation;
  }

  setInputValue(nodeID: string) {
    if (this.allocation.hasOwnProperty(nodeID)) {
      this.sampleSize = this.allocation[nodeID];
    } else {
      this.sampleSize = null;
    }
  }

  focusInput() {
    setTimeout(() => {
      if (this.sampleSizeInput) {
        this.sampleSizeInput.setFocus();
      }
    }, 50);
  }

  // return sampling stage values and Disaggregation for given stage number
  _getStageMeta(stageNumber: number) {
    let meta = this.samplingStages[stageNumber - 1];
    if (!meta) {
      meta = {};
    }
    meta.stageNumber = stageNumber;
    return meta;
  }

  // iterate over all nodes, matching reporting nodes by their title metadata
  // titles given as array of strings, can determine parent by taking active node title (e.g. "[stage1,stage2|-|0|-|Group A"])
  // and removing everything from '|-|' onwards
  _getReportingMeta(node: TreeDiagramNode) {
    try {
      let nodes = this.ngRedux.getState()._treeMeta.nodes;
      let nodePath = node.id.split("/");
      let parentPath = nodePath.slice(0, nodePath.length - 1);
      let parentID = parentPath.join("/");
      // match nodes with same parent, same stage and reporting level
      nodes = nodes.filter(n => {
        return (
          n.id.indexOf(parentID) > -1 &&
          n.title.length == node.title.length &&
          n.group == "reportingLevelNodes"
        );
      });
      return nodes;
    } catch (error) {
      // ignore error when empty node selected
    }
  }

  // updateFinalStageSize(size: number) {
  //     if (size) {
  //         try {
  //             const samplingStages = this.ngRedux.getState().activeProject.values.samplingStages
  //             const finalStage: StageMeta = samplingStages[samplingStages.length - 1]
  //             console.log('final stage', finalStage)
  //             let nodes
  //             // update final reporting level nodes and final stage
  //             if (finalStage["q5.3.4.2"] instanceof Array) {
  //                 nodes = this.nodes.filter(n => {
  //                     return (n.group == 'reportingLevelNodes' && n.id.indexOf('_._') > -1 && n.nodePath.length == samplingStages.length)
  //                 })
  //                 nodes.forEach(n => {

  //                 })
  //                 size = size * (nodes.length / samplingStages.length)
  //             }
  //             // update final stage nodes
  //             nodes = this.nodes.filter(n => {
  //                 return (n.group == 'stageNodes' && n.nodePath.length == samplingStages.length)
  //             })
  //             nodes.forEach(n => {

  //             })
  //             console.log('final nodes', nodes)
  //         } catch (error) {
  //         }
  //     }
  // }
}

interface AllocationMeta {
  type?: string;
  isFinalStage?: boolean;
  isSingleStage?: boolean;
  isPenultimateStage?: boolean;
  hasReportingLevels?: boolean;
  sampleTake?: "All" | "Sample";
  samplingStrategy?: "SRS" | "PPS";
}

// var defaultAllocationMeta = {
//     type: null,
//     isFinalStage: null,
//     isPenultimateStage: null,
//     hasReportingLevels: null,
//     sampleTake: null,
//     samplingStrategy: null
// }
