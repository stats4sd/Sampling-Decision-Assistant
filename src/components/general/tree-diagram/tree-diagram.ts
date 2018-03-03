import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import options from './options'
import { FormProvider } from '../../../providers/form/form';
import { FormGroup } from '@angular/forms';
import { Events } from 'ionic-angular';

declare let vis: any
// import * as vis from 'vis'

@Component({
  selector: 'tree-diagram',
  templateUrl: 'tree-diagram.html'
})
export class TreeDiagramComponent {
  // custom component to represent sampling stages in a tree diagram
  nodeCount: number
  nodes: any[]
  treeNodes: any[]
  treeEdges: any[];
  stages: any;
  form: FormGroup
  @Input('showInputNodes') showInputNodes: boolean

  constructor(formPrvdr: FormProvider, events: Events) {
    this.form = formPrvdr.formGroup
    events.unsubscribe('form:initComplete')
    events.subscribe('form:initComplete', _ => this.prepareStages(this.form.value))
  }

  ngOnInit() {
    this.prepareStages(this.form.value)
    console.log('show input nodes?', this.showInputNodes)

  }



  prepareStages(formValue) {
    // iterate through multi stage list and build nodes for diagram as appropriate
    // uses first and second number to add additional meta node for each stage
    if (this.form && this.form.value['q5.3'] && this.form.value['q5.3'].length > 0) {
      console.log('preparing stages', formValue['q5.3'])
      this.stages = {}
      this.nodes = []
      // dev
      //this.showInputNodes = true

      let tierIndex = 1
      formValue['q5.3'].forEach((stage, i) => {
        //let nodeIndex: number = i + 1
        // seperate cases depend on whether an additional input/meta node will be shown after each node
        if (this.showInputNodes) {
          //nodeIndex = 2 * i + 1
        }
        this.nodeCount = 1
        let stageNodes = []

        // case sample
        // if (stage['q5.3.3'] == 'Sample') {
        //   this.stages[tierIndex] = [this._createNode(tierIndex, stage._parentID, null, null, options.stageTitle)]
        // }
        // case all units selected
        // else if (stage['q5.3.3'] == 'All') {
          // - no reporting level (size uncertain but should be specified)
          if (!stage['q5.3.4.2'] || stage['q5.3.4.2'] == '') {
            this.stages[tierIndex] = [this._createNode(tierIndex, stage._parentID, null, null, options.stageTitle)]
          }
          // - reporting level
          else {
            // title node
            this.stages[tierIndex] = [this._createNode(tierIndex, stage._parentID, null, null, options.stageTitle, true)]
            let allReportingLevels
            tierIndex++
            try {
              let allReportingLevels = JSON.parse(this.form.value.strata)
              let reportingLevelGroup = stage['q5.3.4.2']
              for (let reportingLevel of allReportingLevels[reportingLevelGroup].names) {
                stageNodes.push(this._createNode((tierIndex), reportingLevel.label, null, reportingLevelGroup, options.reportingLevel))
              }
            } catch (error) {
              stageNodes.push(this._createNode((tierIndex), 'reporting level not defined'))
            }
            this.stages[tierIndex] = stageNodes
          }
        // }
        // else {
        //   console.log('no method available for stage', stage)
        // }
        // add number node
        if (this.showInputNodes) { 
          tierIndex++
          this.stages[tierIndex] = [this._createNode((tierIndex + 1), "n =__", null, null, options.sampleSize, true)] 
        }
        tierIndex++
      })
      console.log('stage nodes', this.stages)
      this.addLabelNodes()
      this.buildNodeTree(this.nodes)
    }
  }
  addLabelNodes() {
    console.log('nodes', this.nodes)
    // need to add extra nodes so before start of district there's a stage 'district' which will be simple text node
    // possibly should build early on
  }

  buildNodeTree(nodes) {
    // build hierarchy of stages so that each node in each stage has all possible child nodes
    // tracks in 2 ways, first via stages so that iterative approach can be taken, then also as overall array
    this.treeNodes = this.stages[1]
    let mappedStages = {}
    let totalStages = Object.keys(this.stages).length
    // iterate over each stage
    for (var i = 1; i < totalStages; i++) {
      let childStage = this.stages[i + 1]
      let parentStage = this.stages[i]
      mappedStages[i] = this.stages[i]
      mappedStages[i + 1] = []
      if (childStage) {
        // multiply child stage
        parentStage.forEach((parentNode, ind) => {
          // iterate over each child node
          childStage.forEach(childNode => {
            // create a copy for each parent
            mappedStages[i + 1].push(this._cloneNode(childNode, parentNode, ind))
            this.treeNodes.push(this._cloneNode(childNode, parentNode, ind))
          })
        })
      }
      else {
        childStage.forEach(childNode => {
          mappedStages[i + 1].push(this._cloneNode(childNode, { id: null }, 0))
          this.treeNodes.push(this._cloneNode(childNode, { id: null }, 0))
        })
      }
      this.stages[i + 1] = mappedStages[i + 1]
    }
    this.buildNodeEdges()
  }


  buildNodeEdges() {
    // sort by stage
    let edges = []
    this.treeNodes.forEach(node => {
      if (node.parentID) {
        edges.push({
          from: node.parentID,
          to: node.id
        })
      }
    })
    this.treeEdges = edges
    // strip unwanted bits from tree nodes and rename repeats
    this.treeNodes = this.treeNodes.map(n => {

      let clean: any = {}
      clean.id = n.id
      clean.label = n.label
      if (clean.label == "Final Sampling Unit") { clean.label = this.form.value['q3.1'] }
      if (n.nodeOptions) {
        Object.keys(n.nodeOptions).forEach(k => {
          clean[k] = n.nodeOptions[k]
        })
      }
      return clean
    })
    console.log('tree nodes', this.treeNodes)
    this.buildDiagram(this.treeNodes, this.treeEdges)
  }

  _cloneNode(childNode, parentNode, index) {
    let n: any = {}
    Object.keys(childNode).forEach(k => {
      n[k] = childNode[k]
    })
    n.id = n.id + '-' + index
    n.parentID = parentNode.id
    return n
  }

  _createNode(stage: number, label: string, n?: number, reportingLevelGroup?: string, nodeOptions?: any, titleNode?: boolean) {
    const node = {
      id: stage + '_' + this.nodeCount,
      index: this.nodeCount,
      stage: stage,
      label: label,
      n: n,
      reportingLevelGroup: reportingLevelGroup,
      nodeOptions: nodeOptions
    }
    if (!titleNode) { this.nodeCount++ }

    this.nodes.push(node)
    return node
  }



  ngAfterViewInit() {
    this.prepareStages(this.form.value)
  }

  buildDiagram(treeNodes, treeEdges) {
    // create an array with nodes
    var nodes = new vis.DataSet(treeNodes);

    // create an array with edges
    var edges = new vis.DataSet(treeEdges);

    // create a network
    var container = document.getElementById('mynetwork');

    // provide the data in the vis format
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      physics: {
        enabled: false
      },
      interaction: {
        dragView: true
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
      nodes:{
        widthConstraint:{
          minimum:20,
          maximum:150
        },
        heightConstraint:20
      }

    };


    setTimeout(_ => {
      // initialize your network!
      var network = new vis.Network(container, data, options);
    }, 500)
  }

}