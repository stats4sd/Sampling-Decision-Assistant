import { Component } from "@angular/core";
import { NgRedux, select } from "@angular-redux/store";
import { Subject, Subscription, Observable } from "rxjs";
import { StageMeta, AppState } from "../../../../models/models";
import { CalculatorRecommendations } from "../../sample-size-calculator/sample-size-calculator";
import { Events } from "ionic-angular";

@Component({
  selector: "tree-table",
  templateUrl: "tree-table.html"
})
export class TreeTableComponent {
  // @select(['_treeMeta', 'activeNode']) readonly activeNode$: Observable<TreeDiagramNode>
  samplingStages$: Subscription;
  samplingStages: StageMeta[] = [];
  totalSampleSize: number;
  @select(["activeProject", "values", "_calculatorVars", "recommendations"])
  readonly recommendations$: Observable<CalculatorRecommendations>;
  private componentDestroyed: Subject<any> = new Subject();

  constructor(private ngRedux: NgRedux<AppState>, private events: Events) {
    this._addSubscribers();
  }

  ngOnDestroy() {
    // using subject emits value manually (like event emitter) by calling the 'next()' function
    // on destroy we want to emit any value so that the takeUntil subscription records it no longer needs to subscribe
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

  allocationChange(e, index) {
    // convert strings back to number (will fire change event again)
    if (typeof e._value == "string") {
      this.samplingStages[index].sampleSize = Number(e._value);
    } else {
      this.totalSampleSize = this.samplingStages
        .map(s => (s.sampleSize ? s.sampleSize : 0))
        .reduce((a, b) => a * b);
      console.log("total sample size", this.totalSampleSize);
    }
  }

  _addSubscribers() {
    // use 'takeuntil' to use second observable as an argument. This is only emitted on destruction
    this.samplingStages$ = this.ngRedux
      .select<StageMeta[]>(["activeProject", "values", "samplingStages"])
      .takeUntil(this.componentDestroyed)
      .subscribe(stages => {
        if (stages) {
          this.samplingStages = stages;
          console.log("stages", stages);
          // this.reportingStages = stages.filter(s => {
          //   return s["q5.3.4.2"] && s["q5.3.4.2"].length > 0;
          // });
        }
      });

    // this.allocation$ = this.ngRedux
    //   .select(["activeProject", "values", "allocation"])
    //   .pipe(debounceTime(200))
    //   .takeUntil(this.componentDestroyed)
    //   .subscribe(allocation => {
    //     if (allocation) {
    //       this.calculateTotals(allocation);
    //     }
    //   });
    // *** use events also as redux doesn't seem to capture sub property changes - possibly better if only tracking sample sizes,
    // or had seperate popsize and samplesize objects to track with path subproperties
    // update - even with simple allocation object with only number sub properties still doesn't pick up
    // could try dynamically add select listeners
    // this.events.subscribe("allocation:updated", allocation => {
    //   this.calculateTotals(allocation);
    // });
  }

  /************************************************************************************************************
  NOTE, code below needs review, lots from legacy node diagram allocation methods which are no longer relevant
  CC: 2018-10-02
  *************************************************************************************************************/

  // calculate total fsu and intermediate for each path through tree diagram
  // calculateTotals(allocation) {
  //   const v: ProjectValues = this.ngRedux.getState().activeProject.values;
  //   if (v.reportingLevels) {
  //     this.showByDisaggregation = true;
  //     const reportingNodes = this.getReportingAllocationNodes(
  //       v.samplingStages.length
  //     );
  //     this.reportingTotals = reportingNodes.map(node =>
  //       this.getReportingTotal(node, allocation)
  //     );
  //     console.log("reporting totals", this.reportingTotals);
  //   }
  // }

  // use the existing node data to generate a list similar to stage 4 reporting level combinations
  // getReportingAllocationNodes(totalStages: number = 0) {
  //   const allNodes = this.ngRedux.getState()._treeMeta.nodes;
  //   if (allNodes) {
  //     // match nodes which have path for every stage and contains reporting level at end (i.e. not the final stage name)
  //     // e.g [camp_._campA, District, Households_._male] and not [camp_._campA, District, Households]
  //     let finalStageNodes = allNodes.filter(node => {
  //       let idArray = node.id.split("/");
  //       return (
  //         idArray.length == totalStages &&
  //         idArray[idArray.length - 1].includes("_._")
  //       );
  //     });
  //     return finalStageNodes;
  //   } else {
  //     return [];
  //   }
  // }

  // calculate the total sample size given by multiplying parent nodes upwards
  // getReportingTotal(node: TreeDiagramNode, allocation) {
  //   let idArray = node.id.split("/");
  //   let total = 1;
  //   node.allocationTotal = { byPart: {}, total: total };
  //   idArray.forEach(part => {
  //     // get substring up till part (parent nodes), e.g if [camp_._campA, District, Households_._male]
  //     // want 'camp_.campA' ,'camp_.campA/District',  'camp_._campA/District/Households_._male'
  //     let path: string = node.id.split("/" + part)[0];
  //     let pathAllocation = allocation[path] ? allocation[path] : null;
  //     node.allocationTotal.byPart[path] = pathAllocation;
  //     node.allocationTitle = this.getAllocationTitle(node.id);
  //     total = total * pathAllocation;
  //   });
  //   node.allocationTotal.total = total;
  //   return node;
  // }

  // getAllocationTitle(nodeID: string) {
  //   // split node id array to only parts which contain some reporting allocation
  //   // e.g. [camp_._campA, District, Households_._male] => [camp_._campA, households_._male]
  //   let combination = [];
  //   let idArray = nodeID.split("/");
  //   const reportingArray = idArray.filter(part => {
  //     return part.includes("_._");
  //   });
  //   // finally remove stage name
  //   // e.g. [camp_._campA, households_._male] => [campA, male]
  //   combination = reportingArray.map(part => {
  //     return part.split("_._")[1];
  //   });
  //   return combination;
  // }
}
