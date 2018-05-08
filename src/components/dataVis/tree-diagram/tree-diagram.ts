import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import options from './options'
import { FormProvider } from '../../../providers/form/form';
import { FormGroup } from '@angular/forms';
import { Events } from 'ionic-angular';
import { ReportingLevel, TreeDiagramNode, StageMeta } from '../../../models/models';
import { TreeDiagramActions } from '../../../actions/actions';

declare let vis: any
// import * as vis from 'vis'

@Component({
  selector: 'tree-diagram',
  templateUrl: 'tree-diagram.html'
})
export class TreeDiagramComponent {
  // custom component to represent sampling stages in a tree diagram
  nodes: any[] = [];
  treeNodes: any;
  treeEdges: any;
  form: FormGroup;
  samplingStages: StageMeta[];
  allocation:any;
  @Input('showInputNodes') showInputNodes: boolean
  @Input('showKey') showKey: boolean
  @ViewChild('treeContainer') treeContainer: ElementRef

  constructor(private formPrvdr: FormProvider, private events: Events, private treeActions: TreeDiagramActions) {

    this.events.unsubscribe('form:initComplete')
    // this.events.subscribe('form:initComplete', _ => this.prepareStages(this.form.value))
    this.events.subscribe('form:initComplete', _ => this.treeInit())
  }

  ngOnInit() {
    this.form = this.formPrvdr.formGroup
    //this.prepareStages(this.form.value)
    this.treeInit()
    this.events.unsubscribe('node:updated')
    this.events.subscribe('node:updated',update=>this.updateNode(update))
  }

  treeInit() {
    this.nodes = []
    this.samplingStages = this.form.value.samplingStages
    this.allocation = this.form.value.allocation ? this.form.value.allocation : {}
    this.addFinalStageLevels()
    this.prepareStages()
    this.treeEdges = this.buildNodeEdges(this.nodes)
    this.treeNodes = this._cleanNodeMeta(this.nodes)
    this.buildDiagram(this.treeNodes, this.treeEdges)
    this.treeActions.setNodes(this.treeNodes)
  }

  // check through each stage to see which reporting levels have been assigned,
  // and automatically allocate any remaining to the final stage
  addFinalStageLevels() {
    if (!this.samplingStages) { return }
    let reportingLevels: ReportingLevel[] = this.form.value.reportingLevels
    if (!reportingLevels) { return }
    let reportingLevelNames: string[] = reportingLevels.map(
      level => { return level.name }
    )
    this.samplingStages.forEach(stage => {
      let stageLevels = stage["q5.3.4.2"]
      if (stageLevels) {
        stageLevels.forEach(level => {
          const i = reportingLevelNames.indexOf(level)
          if (i > -1) { reportingLevelNames.splice(i, 1) }
        })
      }
    })
    if (reportingLevelNames.length > 0) {
      let finalStageLevels = this.samplingStages[this.samplingStages.length - 1]["q5.3.4.2"]
      if (finalStageLevels instanceof Array) {
        this.samplingStages[this.samplingStages.length - 1]["q5.3.4.2"] = finalStageLevels.concat(reportingLevelNames)
      }
      else { 
        this.samplingStages[this.samplingStages.length - 1]["q5.3.4.2"] = reportingLevelNames 
      }
    }
  }

  // recursively go through sampling stages, pushing stage name node and in case of reporting requirements build all stages below
  prepareStages(startStage: number = 0, basePath: string[] = []) {
    const samplingStages: StageMeta[] = this.samplingStages
    if (!samplingStages) { return }
    const stage = samplingStages[startStage]
    if (stage) {
      const reportingLevels = stage["q5.3.4.2"]
      let parentID: string
      if (basePath[0]) { parentID = basePath.join('/') }
      // build nodes for reporting levels
      if (reportingLevels) {
        const reportingLevelCombinations = this._buildCombinations(reportingLevels)
        let parentPath = basePath.slice()
        parentPath.push(stage.name)
        // first add parent node
        let node = this._createNode(parentPath, 'stageNodes', parentID)
        node.label = this._generateNodeLabel(node,stage)
        this.nodes.push(node)
        // then iterate over each reporting level combination
        reportingLevelCombinations.forEach((combination,i) => {
          let childPath = basePath.slice()
          childPath.push(stage.name + '_._' + combination)
          let node = this._createNode(childPath, 'reportingLevelNodes', parentPath.join('/'))
          node.label = this._generateNodeLabel(node,stage,i)
          this.nodes.push(node)
          this.prepareStages(startStage + 1, childPath)
        })
      }
      // build nodes if no reporting levels
      else {
        basePath.push(stage.name)
        let node = this._createNode(basePath, 'stageNodes', parentID)
        node.label = this._generateNodeLabel(node,stage)
        this.nodes.push(node)
        this.prepareStages(startStage + 1, basePath)
      }
    }
    else { }
  }

  _buildCombinations(levelNames: string[], arrays?) {
    // takes a list of group names and creates a list of all combinations on their category names
    // e.g if group 1 (gender) has male/female, and group 2 (age) has old/young, want 4 combinations
    // [[male,old], [male,young], [female,old], [female,young]]
    let allReportingLevels: ReportingLevel[] = this.form.value.reportingLevels
    if (!allReportingLevels) { allReportingLevels = [] }
    if (!arrays) {
      // first step is to simply build a list of all the category names that will be used
      // e.g. [male,female],[old,young]
      // build list of category name arrays
      let arrs = []
      // reshape groups to correct form array of arrays
      let i = 0
      allReportingLevels.forEach((level) => {
        if (levelNames.indexOf(level.name) > -1) {
          arrs[i] = []
          level.classifications.names.forEach(name => {
            arrs[i].push(name)
          })
          i++
        }
      })
      // once complete pass back into function to run again
      return this._buildCombinations(levelNames, arrs)
    }
    // on subsequent passes we combine all combinations of the first 2 arrays, remove the first and repeat until only one set remains
    else {
      let combinations = []
      if (arrays[1]) {
        for (let el of arrays[0]) {
          for (let el2 of arrays[1]) {
            // combinations.push(el + ' |∩| ' + el2)
            combinations.push(el + ', ' + el2)
          }
        }
        arrays[1] = combinations
        arrays.splice(0, 1)
        return this._buildCombinations(levelNames, arrays)
      }
      else {
        // final list
        combinations = arrays[0]
        return combinations
      }
    }
  }

  _createNode(path: string[], group: string, parentID: string) {
    let node: any = {
      id: path.slice().join('/'),
      group: group,
      nodePath: path.slice(),
      parentID: parentID
    }
    return node
  }

  // use last part of path as label, extracting reporting level classification if exists and updating with stored value
  _generateNodeLabel(node:any, stage:StageMeta, reportingClassIndex?:number){
    let path = node.nodePath
    let pathEnd = path[path.length - 1]
    let split = pathEnd.split('_._')
    let label = split[split.length - 1]
    // attach allocation value to label
    const allocation = this.allocation[node.id] ? this.allocation[node.id] : {}
    if(node.group=="stageNodes" && allocation.sampleSize){
      label = label + ' ('+allocation.sampleSize+')'
    }
    return label
  }

  buildNodeEdges(nodes) {
    // sort by stage
    let edges = []
    nodes.forEach(node => {
      if (node.parentID) {
        edges.push({
          from: node.parentID,
          to: node.id
        })
      }
    })
    return edges
  }

  // strip unwanted bits from tree nodes and rename repeats
  _cleanNodeMeta(nodes) {
    return nodes.map(n => {
      let clean: any = {}
      clean.id = n.id
      clean.label = n.label
      clean.group = n.group
      clean.title = n.nodePath
      if (clean.label == "Final Sampling Unit") { clean.label = this.form.value['q3.1'] }
      if (n.nodeOptions) {
        Object.keys(n.nodeOptions).forEach(k => {
          clean[k] = n.nodeOptions[k]
        })
      }
      return clean
    })
  }

  _getNode(id) {
    let selected = {}
    this.treeNodes.forEach(n => {
      if (n.id == id) {
        selected = n
      }
    })
    return selected
  }

  buildDiagram(treeNodes, treeEdges) {
    // create an array with nodes
    this.treeNodes = new vis.DataSet(treeNodes);
    // create an array with edges
    this.treeEdges = new vis.DataSet(treeEdges);
    // create a network
    const container = this.treeContainer.nativeElement
    // provide the data in the vis format
    const data = {
      nodes: this.treeNodes,
      edges: this.treeEdges
    };
    const treeOptions = {
      autoResize: true,
      height: '100%',
      width: '100%',
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
          sortMethod: 'directed',
          edgeMinimization: true,
        }
      },
      nodes: {
        widthConstraint: {
          minimum: 20,
          maximum: 80
        },
        heightConstraint: 20
      },
      groups: {
        reportingLevelNodes: options.reportingLevelNodes,
        stageNodes: options.stageNodes
      }
    };

    setTimeout(_ => {
      // initialize your network!
      var network = new vis.Network(container, data, treeOptions);
      // network.on('click', params => {console.log('node clicked', params)})
      network.on('selectNode', params => {
        let selectedNode = this._getNode(params.nodes[0]) as TreeDiagramNode
        this.treeActions.setActiveNode(selectedNode)
      })
      network.on('deselectNode', params => {
        this.treeActions.setActiveNode(null)
      })
        , 500
    })
  }

  updateNode(update:TreeDiagramNode){ 
    console.log('node updated',update)
    this.treeNodes.update({
      id:update.id,
      label:update.label
    })
  }

}