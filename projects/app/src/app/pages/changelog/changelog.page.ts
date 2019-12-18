import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

declare let vis: any;

@Component({
  selector: "app-changelog",
  templateUrl: "./changelog.page.html",
  styleUrls: ["./changelog.page.scss"]
})
export class ChangelogPage implements AfterViewInit {
  constructor(public modalCtrl: ModalController) {}

  async launchSampleSizeCalculator() {
    const modal = await this.modalCtrl.create({
      cssClass: "full-screen",
      component: "SampleSizeCalculatorPage"
    });
    await modal.present();
  }

  // tree diagram demo
  ngAfterViewInit(): void {
    // create an array with nodes
    console.log("vis", vis);
    const nodes = new vis.DataSet([
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
      { id: 4, label: "Node 4" },
      { id: 5, label: "Node 5" }
    ]);

    // create an array with edges
    const edges = new vis.DataSet([
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 3, to: 4 },
      { from: 3, to: 5 }
    ]);

    // create a network
    const container = document.getElementById("mynetwork");

    // provide the data in the vis format
    const data = {
      nodes,
      edges
    };
    const options = {
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
          sortMethod: "directed"
        }
      }
    };

    // initialize your network!
    const network = new vis.Network(container, data, options);
    console.log("network", network);
  }
}
