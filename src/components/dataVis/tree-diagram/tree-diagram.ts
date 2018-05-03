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
  nodeCount: number
  nodes: any[] = []
  treeNodes: any[]
  treeEdges: any[];
  stages: any;
  form: FormGroup;
  nodePath: string[]
  @Input('showInputNodes') showInputNodes: boolean
  @Input('showKey') showKey: boolean
  @ViewChild('treeContainer') treeContainer: ElementRef

  constructor(private formPrvdr: FormProvider, private events: Events, private treeActions: TreeDiagramActions) {

    this.events.unsubscribe('form:initComplete')
    // this.events.subscribe('form:initComplete', _ => this.prepareStages(this.form.value))
    this.events.subscribe('form:initComplete', _ => this.prepareStages2())
  }

  ngOnInit() {
    this.form = this.formPrvdr.formGroup
    //this.prepareStages(this.form.value)
    this.prepareStages2()
  }


  // recursively go through sampling stages, pushing stage name node and in case of reporting requirements build all stages below
  prepareStages2(startStage: number = 0, basePath: string[] = []) {
    const samplingStages: StageMeta[] = this.form.value.samplingStages
    if (!samplingStages) { return }
    const stage = samplingStages[startStage]
    if (stage) {
      const reportingLevels = stage["q5.3.4.2"]
      // build nodes for reporting levels
      if (reportingLevels) {
        const reportingLevelCombinations = this._buildCombinations(reportingLevels)
        console.log('combinations', reportingLevelCombinations)
        reportingLevelCombinations.forEach(combination => {
          basePath.push(stage.name + '_._' + combination)
          this.nodes.push(this._createNode2(basePath, 'reportingLevelNodes'))
          this.prepareStages2(startStage + 1, basePath)
        })
      }
      else {
        basePath.push(stage.name)
        this.nodes.push(this._createNode2(basePath, 'stageNodes'))
        this.prepareStages2(startStage + 1, basePath)
      }
    }
    else {
      let nodeIDs = []
      this.nodes.forEach(n => nodeIDs.push(n.id))
      console.log('nodes ids', nodeIDs)
    }

    // samplingStages.forEach((stage,i)=>{
    //   // update current path
    //   this.nodePath.push(stage.name)
    //   // add stage node
    //   this.nodes.push(this._createNode2(this.nodePath,'stageNodes'))
    //   // add reporting level nodes

    // })

  }
  _buildCombinations(levelNames: string[], arrays?) {
    // takes a list of group names and creates a list of all combinations on their category names
    // e.g if group 1 (gender) has male/female, and group 2 (age) has old/young, want 4 combinations
    // [[male,old], [male,young], [female,old], [female,young]]
    console.log('building combinations', levelNames)
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
            combinations.push(el + ' |∩| ' + el2)
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

  _createNode2(path: string[], group: string) {
    let node: any = {
      id: path.slice().join('/'),
      stage: null,
      label: path.slice().pop().split('|-|').pop(),
      group: group,
      nodePath: path.slice()
    }
    console.log('node created', node)
    return node
  }



  // _addReportingLevelNodes(levels:string[],stageName){
  //   // build combinations of classifications for case when multiple levels defined
  //   const combinations = this._buildCombinations(this.form.value.reportingLevels,levels)
  //   console.log('combinations',combinations)
  //   console.log('node path',this.nodePath)
  //   combinations.forEach(name=>{
  //     const pathPrefix = this.nodePath.slice().pop()
  //     console.log('path prefix',pathPrefix)
  //     // character '_-_' used to denote a reporting level substage
  //     let path = this.nodePath.slice(0,this.nodePath.length-1)
  //     path.push(pathPrefix+'_-_'+name)
  //     this.nodes.push(this._createNode2(path,'reportingLevelNodes'))
  //   })
  // }
  // _getReportingLevelMetaByName(name){
  //   let levelMeta:ReportingLevel = {
  //     name:'undefined',
  //     classifications:{names:['Error not found']}
  //   }
  //   const allReportingLevels = this.form.value.reportingLevels
  //   allReportingLevels.forEach(level=>{
  //     if(level.name==name){
  //       levelMeta=level
  //     }
  //   })
  //   return levelMeta
  // }




  // prepareStages(formValue: any = {}) {
  //   // iterate through multi stage list and build nodes for diagram as appropriate
  //   // uses first and second number to add additional meta node for each stage
  //   this.nodePath = []
  //   if (formValue.samplingStages && formValue.samplingStages.length > 0) {
  //     this.stages = {}
  //     this.nodes = []
  //     let allocatedLevels = []
  //     let tierIndex = 1
  //     formValue.samplingStages.forEach((stage, i) => {
  //       this.nodeCount = 1
  //       let stageNodes = []
  //       this.nodePath.push(stage.name)
  //       // add placeholder reporting levels to the final stage
  //       let isFinalStage: boolean = (formValue.samplingStages.length - 1 == i)
  //       if (isFinalStage) { stage['q5.3.4.2'] = '_final' }
  //       // no reporting levels
  //       if (!stage['q5.3.4.2'] || stage['q5.3.4.2'].length == 0) {
  //         this.stages[tierIndex] = [this._createNode(tierIndex, stage.name, 'stageNodes')]
  //       }
  //       // - reporting level
  //       else {
  //         // title node
  //         this.stages[tierIndex] = [this._createNode(tierIndex, stage.name, 'stageNodes', true)]
  //         tierIndex++
  //         // track allocated stages and add final stage levels
  //         try {
  //           let allReportingLevels = formValue.reportingLevels
  //           if (stage['q5.3.4.2'] == "_final") { stage['q5.3.4.2'] = this._addFinalStageLevels(allReportingLevels, allocatedLevels) }
  //           stage['q5.3.4.2'].forEach(level => allocatedLevels.push(level))
  //           // build nodes (and combinations if multiple)            
  //           let reportingLevelGroups = this._buildCombinations(allReportingLevels, stage['q5.3.4.2'])
  //           if (reportingLevelGroups) {
  //             reportingLevelGroups.forEach((reportingLevel, i) => {
  //               this.nodePath.pop()
  //               this.nodePath.push(stage.name + '|-|' + i + '|-|' + reportingLevel)
  //               stageNodes.push(this._createNode((tierIndex), reportingLevel, 'reportingLevelNodes', stage.sampleSize))
  //             })
  //           }
  //         } catch (error) {
  //           stageNodes.push(this._createNode((tierIndex), 'reporting level not defined', 'reportingLevelUndefined'))
  //         }


  //         this.stages[tierIndex] = stageNodes
  //       }
  //       tierIndex++
  //     })
  //     this.buildNodeTree(this.nodes)
  //   }
  // }
  _addFinalStageLevels(allReportingLevels: ReportingLevel[], allocatedLevels: string[]) {
    // add any unallocated reporting levels to final stage
    let levels = []
    allReportingLevels.forEach(level => {
      if (allocatedLevels.indexOf(level.name) == -1) { levels.push(level.name) }
    })
    return levels
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
    this.buildDiagram(this.treeNodes, this.treeEdges)
    this.treeActions.setNodes(this.treeNodes)
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
    this.treeNodes = this._cleanNodeMeta(this.treeNodes)
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

  _cloneNode(childNode, parentNode, index) {
    let n: any = {}
    Object.keys(childNode).forEach(k => {
      n[k] = childNode[k]
    })
    n.id = n.id + '-' + index
    n.parentID = parentNode.id
    return n
  }


  _createNode(stage: number, label: string, group: string, titleNode?: boolean) {
    let node: any = {
      id: stage + '_' + this.nodeCount,
      index: this.nodeCount,
      stage: stage,
      label: label,
      group: group,
      nodePath: this.nodePath.slice()
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
    // this.prepareStages(this.form.value)
  }

  buildDiagram(treeNodes, treeEdges) {
    // create an array with nodes
    const nodes = new vis.DataSet(treeNodes);

    // create an array with edges
    const edges = new vis.DataSet(treeEdges);

    // create a network
    const container = this.treeContainer.nativeElement

    // provide the data in the vis format
    const data = {
      nodes: nodes,
      edges: edges
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
      // network.on('click', params => {
      //   console.log('node clicked', params)
      // })
      network.on('selectNode', params => {
        let selectedNode = this._getNode(params.nodes[0]) as TreeDiagramNode
        // this.events.publish('nodeSelected', selectedNode)
        this.treeActions.setActiveNode(selectedNode)
      })
      network.on('deselectNode', params => {
        // this.events.publish('nodeSelected', {})
        this.treeActions.setActiveNode(null)
      })
        , 500
    })
  }

}