import { Component } from '@angular/core';
import { StagePage } from '../../../../pages/sampling tool/step-by-step/stage/stage';

// import * as vis from 'vis'
declare let vis: any


@Component({
  selector: 'stage-6',
  templateUrl: 'stage-6.html'
})
export class Stage6Component extends StagePage {

  ngOnInit() {
    // this.form.valueChanges.subscribe(v => this.prepareStages(v))
  }

  nodeCount: number
  nodes: any[]
  treeNodes: any[]
  treeEdges: any[]

  prepareStages(formValue) {
    // iterate through multi stage list and build nodes for diagram as appropriate
    if (this.form && this.form.value['q5.3'] && this.form.value['q5.3'].length > 0) {
      console.log('preparing stages', formValue)
      this.stages = {}
      this.nodes = []
      formValue['q5.3'].forEach((stage, i) => {
        // case all units selected
        let stageNumber = i + 1
        this.nodeCount = 1
        let stageNodes = []
        if (stage['q5.3.3'] == 'All') {
          stageNodes.push(this._createNode(stageNumber, stage._parentID, stage['q5.3.3.1']))
        }
        // case sample but no stratification
        else if (stage['q5.3.4.1'] == 'No') {
          stageNodes.push(this._createNode(stageNumber, stage._parentID))
        }
        // case stratification
        else {
          for (let strataGroup of stage['q5.3.4.2']) {
            let allStrata
            try {
              let allStrata = JSON.parse(this.form.value.strata)
              for (let strata of allStrata[strataGroup].names) {
                stageNodes.push(this._createNode(stageNumber, strata.label, null, strataGroup))
              }
            } catch (error) {
              stageNodes.push(this._createNode(stageNumber, 'strata not defined'))
            }
          }
        }
        this.stages[stageNumber] = stageNodes
      })
      console.log('stage nodes', this.stages)
      this.buildNodeTree(this.nodes)
    }
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
    console.log('mapped stages', mappedStages)
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

  _createNode(stage: string, label: string, n?: number, strataGroup?: string) {
    const node = {
      id: stage + '_' + this.nodeCount,
      index: this.nodeCount,
      stage: stage,
      label: label,
      n: n,
      strataGroup: strataGroup
    }
    this.nodeCount++
    this.nodes.push(node)
    return node
  }



  ngAfterViewInit() {
    this.prepareStages(this.form.value)
  }

  buildDiagram(treeNodes, treeEdges) {
    // create an array with nodes
    console.log('vis', vis)
    var nodes = new vis.DataSet(treeNodes);
    console.log('nodes', nodes)

    // create an array with edges
    var edges = new vis.DataSet(treeEdges);
    console.log('edges', edges)

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
        dragView: false
      },
      layout: {
        hierarchical: {
          enabled: true,
          levelSeparation: 100,
          sortMethod: 'directed',
          improvedLayout: true,
          edgeMinimization: true,
        }
      }
    };

    
    setTimeout(_=>{
      // initialize your network!
    var network = new vis.Network(container, data, options);
    },500)
  }

}