import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import options from "./options";
import { FormProvider } from "src/app/services/form/form";
import { FormGroup } from "@angular/forms";
import { Events } from "@ionic/angular";
import {
  ReportingLevel,
  TreeDiagramNode,
  StageMeta,
  AppState,
  ProjectValues
} from "../../../models/models";
import { TreeDiagramActions } from "../../../actions/actions";
import { select, NgRedux } from "@angular-redux/store";
import { Observable, Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { DataProvider } from "src/app/services/data/data";
import { DataVisProvider } from "src/app/services/data-vis/data-vis";

declare let vis: any;
// format to lazy load vis if there weren't conflict with hammer.js
// import * as vis from 'vis'

@Component({
  selector: "tree-diagram",
  templateUrl: "tree-diagram.html",
  styleUrls: ["tree-diagram.scss"]
})
export class TreeDiagramComponent {
  removeSubscriptions$ = new Subject();
  // custom component to represent sampling stages in a tree diagram
  nodes: any[] = [];
  treeNodes: any;
  treeEdges: any;
  treeDiagram: any;
  form: FormGroup;
  samplingStages: StageMeta[];
  initComplete: boolean;
  allocation: any;
  @Input("showInputNodes")
  showInputNodes: boolean;
  @Input("showKey")
  showKey: boolean;
  @ViewChild("treeContainer", { static: true })
  readonly treeContainer: ElementRef;
  @select(["activeProject", "values"])
  readonly projectValues$: Observable<ProjectValues>;
  // @select(['activeProject', 'values', '_calculatorVars', 'inputs', 'nHH']) readonly finalStageSampleSize$: Observable<number>;

  constructor(
    public formPrvdr?: FormProvider,
    public events?: Events,
    public treeActions?: TreeDiagramActions,
    public ngRedux?: NgRedux<AppState>,
    public dataPrvdr?: DataProvider,
    private dataVisPrvdr?: DataVisProvider
  ) {}

  ngOnDestroy(): void {
    this.removeSubscriptions$.next();
    this.removeSubscriptions$.complete();
    this.events.unsubscribe("node:updated");
  }

  ngAfterViewInit() {
    this.initComplete = false;
    this.events.unsubscribe("node:updated");
    this.events.subscribe("node:updated", update => this.updateNode(update));
    this.projectValues$
      .pipe(debounceTime(200))
      .pipe(takeUntil(this.removeSubscriptions$))
      .subscribe(v => {
        if (v && !this.initComplete) {
          this.treeInit(v);
          this.initComplete = true;
        }
      });
  }

  treeInit(values) {
    this.nodes = [];
    // this.updateFinalStageSize(values)
    this.samplingStages = values.samplingStages;
    this.allocation = values.allocation ? values.allocation : {};
    this.addFinalStageLevels();
    this.prepareStages();
    this.treeEdges = this.buildNodeEdges(this.nodes);
    this.treeNodes = this._cleanNodeMeta(this.nodes);
    this.treeActions.setNodes(this.treeNodes);
    this.buildDiagram(this.treeNodes, this.treeEdges);
  }

  // check through each stage to see which Disaggregation have been assigned,
  // and automatically allocate any remaining to the final stage
  addFinalStageLevels() {
    if (!this.samplingStages) {
      return;
    }
    let reportingLevels: ReportingLevel[] = this.ngRedux.getState()
      .activeProject.values.reportingLevels;
    if (!reportingLevels) {
      return;
    }
    let reportingLevelNames: string[] = reportingLevels.map(level => {
      return level.name;
    });
    this.samplingStages.forEach(stage => {
      let stageLevels = stage["q5.3.4.2"];
      if (stageLevels) {
        stageLevels.forEach(level => {
          const i = reportingLevelNames.indexOf(level);
          if (i > -1) {
            reportingLevelNames.splice(i, 1);
          }
        });
      }
    });
    if (reportingLevelNames.length > 0) {
      let finalStageLevels = this.samplingStages[
        this.samplingStages.length - 1
      ]["q5.3.4.2"];
      if (finalStageLevels instanceof Array) {
        this.samplingStages[this.samplingStages.length - 1][
          "q5.3.4.2"
        ] = finalStageLevels.concat(reportingLevelNames);
      } else {
        this.samplingStages[this.samplingStages.length - 1][
          "q5.3.4.2"
        ] = reportingLevelNames;
      }
    }
  }

  // recursively go through sampling stages, pushing stage name node and in case of reporting requirements build all stages below
  prepareStages(startStage: number = 0, basePath: string[] = []) {
    const samplingStages: StageMeta[] = this.samplingStages;
    if (!samplingStages) {
      return;
    }
    const stage = samplingStages[startStage];
    if (stage) {
      const reportingLevels = stage["q5.3.4.2"];
      let parentID: string;
      if (basePath[0]) {
        parentID = basePath.join("/");
      }
      // build nodes for Disaggregation
      if (reportingLevels) {
        const reportingLevelCombinations = this.dataVisPrvdr.buildReportingCombinations(
          reportingLevels
        );
        let parentPath = basePath.slice();
        parentPath.push(stage.name);
        // first add parent node
        let node = this._createNode(parentPath, "stageNodes", parentID);
        node.label = this._generateNodeLabel(node, stage);
        this.nodes.push(node);
        // then iterate over each reporting level combination
        reportingLevelCombinations.forEach((combination, i) => {
          let childPath = basePath.slice();
          childPath.push(stage.name + "_._" + combination);
          const className = "strataOnlyNodes";
          let node = this._createNode(
            childPath,
            className,
            parentPath.join("/")
          );
          node.label = this._generateNodeLabel(node, stage, i);
          this.nodes.push(node);
          this.prepareStages(startStage + 1, childPath);
        });
      }
      // build nodes if no Disaggregation
      else {
        basePath.push(stage.name);
        let node = this._createNode(basePath, "stageNodes", parentID);
        node.label = this._generateNodeLabel(node, stage);
        this.nodes.push(node);
        this.prepareStages(startStage + 1, basePath);
      }
    } else {
    }
  }

  _createNode(path: string[], group: string, parentID: string) {
    let node: any = {
      id: path.slice().join("/"),
      group: group,
      nodePath: path.slice(),
      parentID: parentID
    };
    return node;
  }

  // use last part of path as label, extracting reporting level classification if exists and updating with stored value
  _generateNodeLabel(
    node: any,
    stage: StageMeta,
    reportingClassIndex?: number
  ) {
    let path = node.nodePath;
    let pathEnd = path[path.length - 1];
    let split = pathEnd.split("_._");
    let label = split[split.length - 1];
    // attach allocation value to label
    const sampleSize = this.allocation[node.id]
      ? this.allocation[node.id]
      : null;
    // could change here if want different display for reporting label vs stage (i.e if node.group=='stageNodes'...)
    if (sampleSize) {
      label = label + " (" + sampleSize + ")";
    }
    return label;
  }

  buildNodeEdges(nodes = []) {
    // sort by stage
    let edges = [];
    nodes.forEach(node => {
      if (node.parentID) {
        edges.push({
          from: node.parentID,
          to: node.id
        });
      }
    });
    return edges;
  }

  // strip unwanted bits from tree nodes and rename repeats
  _cleanNodeMeta(nodes) {
    return nodes.map(n => {
      let clean: any = {};
      clean.id = n.id;
      clean.label = n.label;
      clean.group = n.group;
      clean.title = n.nodePath;
      if (clean.label == "Final Sampling Unit") {
        clean.label = this.ngRedux.getState().activeProject.values["q3.1"];
      }
      if (n.nodeOptions) {
        Object.keys(n.nodeOptions).forEach(k => {
          clean[k] = n.nodeOptions[k];
        });
      }
      return clean;
    });
  }

  _getNode(id) {
    let selected = {};
    this.treeNodes.forEach(n => {
      if (n.id == id) {
        selected = n;
      }
    });
    return selected;
  }

  buildDiagram(treeNodes, treeEdges) {
    // create an array with nodes
    this.treeNodes = new vis.DataSet(treeNodes);
    // create an array with edges
    this.treeEdges = new vis.DataSet(treeEdges);
    const container = this.treeContainer.nativeElement;
    // provide the data in the vis format
    const data = {
      nodes: this.treeNodes,
      edges: this.treeEdges
    };
    const treeOptions = {
      autoResize: true,
      height: "100%",
      width: "100%",
      physics: {
        enabled: false
      },
      interaction: {
        dragView: true,
        tooltipDelay: 9999
      },
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled: true,
          levelSeparation: 75,
          sortMethod: "directed",
          edgeMinimization: true
        }
      },
      nodes: {
        widthConstraint: {
          minimum: 20,
          maximum: 80
        },
        heightConstraint: 20,
        font: {
          multi: true
        }
      },
      groups: {
        reportingLevelNodes: options.reportingLevelNodes,
        stageNodes: options.stageNodes,
        strataOnlyNodes: options.strataOnlyNodes
      }
    };
    setTimeout(_ => {
      // initialize your network!
      this.treeDiagram = new vis.Network(container, data, treeOptions);
      // network.on('click', params => {console.log('node clicked', params)})
      this.treeDiagram.on("selectNode", params => {
        let selectedNode = this._getNode(params.nodes[0]) as TreeDiagramNode;
        this.treeActions.setActiveNode(selectedNode);
      });
      this.treeDiagram.on("deselectNode", params => {
        this.treeActions.setActiveNode(null);
      }),
        500;
    });
  }

  updateNode(update: TreeDiagramNode) {
    this.treeNodes.update({
      id: update.id,
      label: update.label
    });
  }

  updateStageControl(stageIndex: number, update: any) {
    let allStages = this.formPrvdr.formGroup.controls.samplingStages.value.slice();
    allStages[stageIndex] = Object.assign({}, allStages[stageIndex], update);
    this.formPrvdr.formGroup.patchValue({
      samplingStages: allStages
    });
    this.dataPrvdr.backgroundSave();
  }
}
