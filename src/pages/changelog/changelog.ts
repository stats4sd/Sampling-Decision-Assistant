import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare let vis: any


@IonicPage({
  segment: 'changelog',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-changelog',
  templateUrl: 'changelog.html',
})
export class ChangelogPage {


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangelogPage');
  }
  // tree diagram demo
  ngAfterViewInit() {
    // create an array with nodes
    console.log('vis', vis)
    var nodes = new vis.DataSet([
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' }
    ]);

    // create an array with edges
    var edges = new vis.DataSet([
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 3, to: 4 },
      { from: 3, to: 5 }
    ]);

    // create a network
    var container = document.getElementById('mynetwork');

    // provide the data in the vis format
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
          levelSeparation: 100,
          sortMethod: 'directed'
        }
      }
    };

    // initialize your network!
    var network = new vis.Network(container, data, options);
  }

}
