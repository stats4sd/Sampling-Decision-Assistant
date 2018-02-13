import { Component, Input, ViewChild, ElementRef } from '@angular/core';
declare let vis: any
// import * as vis from 'vis'

@Component({
  selector: 'tree-diagram',
  templateUrl: 'tree-diagram.html'
})
export class TreeDiagramComponent {
  // custom component to represent sampling stages in a tree diagram
  @ViewChild('treeContainer') treeContainer: ElementRef;
  @Input() set nodes(nodes) {
    if (nodes) { this._updateNodes(nodes) }

  }
  treeDiagram: any;
  treeProperties = {
    height: '250px'
  }
  _nodes = []


  _updateNodes(nodes: any) {
    // set base node of final sampling unit, add any more from list and final placeholder

    console.log('tree container', this.treeContainer)
    nodes = JSON.parse(nodes)
    this.treeProperties.height = 200 + (nodes.length * 20) + 'px'
    let temp = []
    nodes.forEach((v, i) => {
      temp.push({
        id: i + 2,
        label: v,
        group: 'applied'
      })
    })
    // temp.push({ id: nodes.length+2, label: '', group: 'pending' })
    // update edges
    let edges = []
    temp.forEach((node, i) => {
      edges.push({
        from: i + 1,
        to: i + 2,
        group: 'applied'
      },
      )
    })
    if (this.treeDiagram) {
      this.treeDiagram.setData({
        nodes: temp,
        edges: edges
      })
    }

  }



  ngAfterViewInit() {
    this._initTree()
  }





  _initTree() {
    // create an array with nodes
    var nodes = new vis.DataSet([
      { id: 1, label: 'Final Sampling Unit', group: 'applied' },
      { id: 2, label: '', group: 'pending' },
    ]);
    var edges = new vis.DataSet([
      { from: 1, to: 2, group: 'applied' },
      { from: 2, to: 3, group: 'pending' },
    ]);
    var container = document.getElementById('treeContainer');
    var data = {
      nodes: nodes,
      edges: edges
    };

    var options = {
      physics: {
        enabled: false
      },
      interaction: {
        dragView: false
      },
      layout: {
        hierarchical: {
          enabled: true,
          levelSeparation: 50,
          nodeSpacing: 50,
          sortMethod: 'directed'
        }
      },
      nodes: {
        shape: 'ellipse',
        widthConstraint: 100,

      },
      groups: {
        pending: {
          color: {
            background: 'rgba(128,128,128,0.4)',
            border: 'rgba(128,128,128,0.4)'
          }
        }
      }
    };
    // initialize your network!
    this.treeDiagram = new vis.Network(container, data, options);
  }
}


// // default options
// var options = {
//   nodes: {
//     borderWidth: 1,
//     borderWidthSelected: 2,
//     brokenImage: undefined,
//     chosen: true,
//     color: {
//       border: '#2B7CE9',
//       background: '#97C2FC',
//       highlight: {
//         border: '#2B7CE9',
//         background: '#D2E5FF'
//       },
//       hover: {
//         border: '#2B7CE9',
//         background: '#D2E5FF'
//       }
//     },
//     fixed: {
//       x: false,
//       y: false
//     },
//     font: {
//       color: '#343434',
//       size: 14, // px
//       face: 'arial',
//       background: 'none',
//       strokeWidth: 0, // px
//       strokeColor: '#ffffff',
//       align: 'center',
//       multi: false,
//       vadjust: 0,
//       bold: {
//         color: '#343434',
//         size: 14, // px
//         face: 'arial',
//         vadjust: 0,
//         mod: 'bold'
//       },
//       ital: {
//         color: '#343434',
//         size: 14, // px
//         face: 'arial',
//         vadjust: 0,
//         mod: 'italic',
//       },
//       boldital: {
//         color: '#343434',
//         size: 14, // px
//         face: 'arial',
//         vadjust: 0,
//         mod: 'bold italic'
//       },
//       mono: {
//         color: '#343434',
//         size: 15, // px
//         face: 'courier new',
//         vadjust: 2,
//         mod: ''
//       }
//     },
//     group: undefined,
//     heightConstraint: false,
//     hidden: false,
//     icon: {
//       face: 'FontAwesome',
//       code: undefined,
//       size: 50,  //50,
//       color: '#2B7CE9'
//     },
//     image: undefined,
//     label: undefined,
//     labelHighlightBold: true,
//     level: undefined,
//     mass: 1,
//     physics: true,
//     scaling: {
//       min: 10,
//       max: 30,
//       label: {
//         enabled: false,
//         min: 14,
//         max: 30,
//         maxVisible: 30,
//         drawThreshold: 5
//       },
//       customScalingFunction: function (min, max, total, value) {
//         if (max === min) {
//           return 0.5;
//         }
//         else {
//           let scale = 1 / (max - min);
//           return Math.max(0, (value - min) * scale);
//         }
//       }
//     },
//     shadow: {
//       enabled: false,
//       color: 'rgba(0,0,0,0.5)',
//       size: 10,
//       x: 5,
//       y: 5
//     },
//     shape: 'ellipse',
//     shapeProperties: {
//       borderDashes: false, // only for borders
//       borderRadius: 6,     // only for box shape
//       interpolation: false,  // only for image and circularImage shapes
//       useImageSize: false,  // only for image and circularImage shapes
//       useBorderWithImage: false  // only for image shape
//     },
//     size: 25,
//     title: undefined,
//     value: undefined,
//     widthConstraint: false,
//     x: undefined,
//     y: undefined
//   },
//   layout: {
//     randomSeed: undefined,
//     improvedLayout:true,
//     hierarchical: {
//       enabled:false,
//       levelSeparation: 150,
//       nodeSpacing: 100,
//       treeSpacing: 200,
//       blockShifting: true,
//       edgeMinimization: true,
//       parentCentralization: true,
//       direction: 'UD',        // UD, DU, LR, RL
//       sortMethod: 'hubsize'   // hubsize, directed
//     }
//   }
// }
