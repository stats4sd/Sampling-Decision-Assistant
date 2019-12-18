import { Component, Input, OnInit } from "@angular/core";
// dev
import { IResourceQuestion, IStageResources } from "../../../../models/models";
import { ALL_RESOURCES } from "src/app/data";

@Component({
  selector: "resources-list",
  templateUrl: "resources-list.html",
  styleUrls: ["resources-list.scss"]
})
export class ResourcesListComponent implements OnInit {
  @Input() stageNumber: string;
  @Input() relevant: string;

  allResources: { [stageID: string]: IStageResources } = ALL_RESOURCES;
  stageResources: IResourceQuestion[] = [];
  otherQuestions: IResourceQuestion[] = [];
  relevantQuestions: IResourceQuestion[];

  constructor() {}
  ngOnInit(): void {
    const stageQuestions = this.getStageQuestions();
    console.log("stage resources", this.stageResources);
    const sortedQuestions = this._sortQuestions(stageQuestions);
    const { relevant, nonRelevant } = this.getRelevantQuestions(
      sortedQuestions
    );
    console.log("relevant", this.relevant);
    this.otherQuestions = nonRelevant;
    this.relevantQuestions = relevant;
  }

  /**
   * When fetching resources return either just questions for the stage
   * all all questions when not defined
   */
  getStageQuestions(): IResourceQuestion[] {
    return this.stageNumber
      ? Object.values(
          this.allResources[`stage${this.stageNumber}Resources`].questions
        )
      : [].concat.apply(
          [],
          Object.values(this.allResources).map(v => Object.values(v.questions))
        );
  }
  // resources are populated Q1, Q2 etc. need to add better sort so that Q10 does not follow Q1
  _sortQuestions(questions: IResourceQuestion[]) {
    questions = questions.sort((a, b) => {
      const indexA: number = Number(a._key.substring(1));
      const indexB: number = Number(b._key.substring(1));
      return indexA - indexB;
    });
    return questions;
  }
  // if relevant question specified push those matching to a new array and remove from full questions list
  getRelevantQuestions(questions: IResourceQuestion[]) {
    const relevant: IResourceQuestion[] = [];
    const nonRelevant: IResourceQuestion[] = [];
    const r = this.relevant ? this.relevant : "N/A";
    questions.forEach(q => {
      if (q.relevant && q.relevant.includes(r)) {
        relevant.push(q);
      } else {
        nonRelevant.push(q);
      }
    });
    return { relevant, nonRelevant };
  }
}
