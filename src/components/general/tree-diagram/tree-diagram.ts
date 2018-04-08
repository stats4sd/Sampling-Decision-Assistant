import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import options from './options'
import { FormProvider } from '../../../providers/form/form';
import { FormGroup } from '@angular/forms';
import { Events } from 'ionic-angular';
import { reportingLevel } from '../../../models/models';

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
  @ViewChild('treeContainer') treeContainer: ElementRef

  constructor(private formPrvdr: FormProvider, private events: Events) {
    
    this.events.unsubscribe('form:initComplete')
    this.events.subscribe('form:initComplete', _ => this.prepareStages(this.form.value))
  }

  ngOnInit() {
    this.form = this.formPrvdr.formGroup
    this.prepareStages(this.form.value)
  }



  prepareStages(formValue:any={}) {
    // iterate through multi stage list and build nodes for diagram as appropriate
    // uses first and second number to add additional meta node for each stage
    if (formValue.samplingStages && formValue.samplingStages.length > 0) {
      console.log('preparing stages', formValue.samplingStages)
      this.stages = {}
      this.nodes = []
      let allocatedLevels = []
      let tierIndex = 1
      formValue.samplingStages.forEach((stage, i) => {
        console.log('stage', i, stage)
        //let nodeIndex: number = i + 1
        // seperate cases depend on whether an additional input/meta node will be shown after each node
        // if (this.showInputNodes) {
        //   //nodeIndex = 2 * i + 1
        // }
        this.nodeCount = 1
        let stageNodes = []
        // add placeholder reporting levels to the final stage
        let isFinalStage: boolean = (formValue.samplingStages.length - 1 == i)
        if (isFinalStage) { stage['q5.3.4.2'] = '_final' }
        // no reporting levels
        if (!stage['q5.3.4.2'] || stage['q5.3.4.2'].length==0) {
          this.stages[tierIndex] = [this._createNode(tierIndex, stage.name, null, null, options.stageTitle)]
        }
        // - reporting level
        else {
          // title node
          this.stages[tierIndex] = [this._createNode(tierIndex, stage.name, null, null, options.stageTitle, true)]
          tierIndex++
          // track allocated stages and add final stage levels
          try {
            let allReportingLevels = formValue.reportingLevels
            if (stage['q5.3.4.2'] == "_final") { stage['q5.3.4.2'] = this._addFinalStageLevels(allReportingLevels, allocatedLevels) }
            stage['q5.3.4.2'].forEach(level => allocatedLevels.push(level))
            // build nodes (and combinations if multiple)            
            let reportingLevelGroups = this._buildCombinations(allReportingLevels, stage['q5.3.4.2'])
            console.log('reportingLevelGroup', reportingLevelGroups)
            if(reportingLevelGroups){
              for (let reportingLevel of reportingLevelGroups) {
                stageNodes.push(this._createNode((tierIndex), reportingLevel, null, null, options.reportingLevel))
              }
            }
          } catch (error) {
            stageNodes.push(this._createNode((tierIndex), 'reporting level not defined'))
          }


          this.stages[tierIndex] = stageNodes
        }
        // add number node
        // if (this.showInputNodes) {
        //   tierIndex++
        //   this.stages[tierIndex] = [this._createNode((tierIndex + 1), "n =__", null, null, options.sampleSize, true)]
        // }
        tierIndex++
      })
      console.log('stage nodes', this.stages)
      this.addLabelNodes()
      this.buildNodeTree(this.nodes)
    }
  }
  _addFinalStageLevels(allReportingLevels:reportingLevel[], allocatedLevels:string[]) {
    // add any unallocated reporting levels to final stage
    let levels = []
    allReportingLevels.forEach(level => {
      if (allocatedLevels.indexOf(level.name) == -1) { levels.push(level.name) }
    })
    return levels
  }

  _buildCombinations(allReportingLevels:reportingLevel[], groups:string[], arrays?) {
    // takes a list of group names and creates a list of all combinations on their category names
    // e.g if group 1 (gender) has male/female, and group 2 (age) has old/young, want 4 combinations
    // [[male,old], [male,young], [female,old], [female,young]]
    if (!arrays) {
      // first step is to simply build a list of all the category names that will be used
      // e.g. [male,female],[old,young]
      // build list of category name arrays
      let arrs = []
      // reshape groups to correct form array of arrays
      let i = 0
      allReportingLevels.forEach((level)=>{
        if(groups.indexOf(level.name)>-1){
          arrs[i]=[]
          level.classifications.names.forEach(name=>{
            arrs[i].push(name)
          })
          i++
        }
      })
      // once complete pass back into function to run again
      return this._buildCombinations(allReportingLevels, groups, arrs)
    }
    // on subsequent passes we combine all combinations of the first 2 arrays, remove the first and repeat until only one set remains
    else {
      let combinations = []
      if (arrays[1]) {
        for (let el of arrays[0]) {
          for (let el2 of arrays[1]) {
            combinations.push(el + ' |∩| ' + el2)
          }
        }
        arrays[1] = combinations
        arrays.splice(0, 1)
        return this._buildCombinations(allReportingLevels, groups, arrays)
      }
      else {
        // final list
        combinations = arrays[0]
        return combinations
      }
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
    console.log('creating node',stage,label)
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

  _getNode(id) {
    let selected = {}
    this.treeNodes.forEach(n => {
      if (n.id == id) {
        selected = n
      }
    })
    return selected
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
    var container = this.treeContainer.nativeElement

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
      nodes: {
        widthConstraint: {
          minimum: 20,
          maximum: 80
        },
        heightConstraint: 20
      }

    };


    setTimeout(_ => {
      // initialize your network!
      var network = new vis.Network(container, data, options);
      // network.on('click', params => {
      //   console.log('node clicked', params)
      // })
      network.on('selectNode', params => {
        let selectedNode = this._getNode(params.nodes[0])
        this.events.publish('nodeSelected', selectedNode)
      })
      network.on('deselectNode', params => {
        this.events.publish('nodeSelected', {})
      })
        , 500
    })
  }

}