import { CalculatorVars } from "../components/dataVis/sample-size-calculator/sample-size-calculator";

// models for how variables should be stored

export interface Project {
  title?: string;
  description?: string;
  created: number;
  edited: number;
  values: ProjectValues;
  stagesComplete: boolean[];
  dbVersion: number;
  draft?: boolean;
}

export interface IQuestionMeta {
  isQuestion: string;
  controlName: string;
  type:
    | "select"
    | "text"
    | "number"
    | "range"
    | "custom-reporting-levels"
    | "custom-stages-define"
    | "repeat"
    | "custom-strata-select"
    | "info";
  selectOptions?: string[];
  options?: any;
  repeatGroup?: string;
  label: string;
  section: string;
  condition: string;
  labelMultiple?: string;
  hideOnReview?: boolean;
}

export type SavedProjects = Project[];

export interface AppState {
  activeProject?: Project;
  savedProjects?: Project[];
  editMode?: boolean;
  reviewMode?: boolean;
  view: ViewState;
  _dbVersion?: number;
  _platforms?: string[];
  _treeMeta: TreeState;
}

export interface ViewState {
  params?: ViewStateParams;
  hash?: string;
  activeStageID?: string;
  lockHash?: string;
}

export interface ViewStateParams {
  stagePart?: number;
  activeGlossaryTerm?: string;
  tabSection?: "resources" | "glossary";
  relevant?: string;
}

export interface TreeState {
  activeNode?: TreeDiagramNode;
  nodes?: TreeDiagramNode[];
  infoSection?: "info" | "allocation";
}

export interface Question {
  isQuestion: string;
  controlName: string;
  repeatGroup?: string;
  type: string;
  selectOptions?: string[];
  label: string;
  section: string;
  condition?: string;
  labelMultiple?: string;
  options?: any;
  triggers?: any;
  conditionJson?: any;
}

export interface ReportingLevel {
  name: string;
  classifications: ReportingLevelClassification;
}

export interface ReportingLevelClassification {
  names: string[];
  total?: string;
}

export interface IGlossaryTerm {
  slug: string;
  definition: string;
  term: string;
  links?: string;
}

export interface IStageResources {
  questions: { [questionName: string]: IResourceQuestion };
}
export interface IStageMeta {
  name: string;
  title: string;
  icon: string;
  number: number;
}
export interface IResourceQuestion {
  _key: string;
  a: string;
  q: string;
  relevant?: string[];
  tags?: string[];
  audio?: string;
  video?: string;
  youtubeID?: string;
  _expanded?: boolean;
  _showFormat?: string;
}
// hard coded into stages page but keeping as reminder of how to
// allow for any json key but with specific value format
// interface stages {
//   [stageId: string]: IStageMeta;
// }

// tree diagram
export interface TreeDiagramNode {
  id?: string;
  label?: string;
  group?: string;
  title?: string[];
  allocationTotal?: TreeDiagramNodeFinalAllocation;
  allocationTitle?: string[];
}

// used by tree table when getting total of reporting combination
interface TreeDiagramNodeFinalAllocation {
  byPart: any;
  total: number;
}

export interface ExtendedTreeDiagramNode extends TreeDiagramNode {
  reportingMeta?: TreeDiagramNode[];
  stageMeta?: StageMeta;
}

export interface TreeDiagramNodeColor {
  background: string;
  border: string;
  highlight: TreeDiagramNodeNodeColorHighlight;
}

export interface TreeDiagramNodeNodeColorHighlight {
  background: string;
  border: string;
}

// stage meta stored on samplingStages value
export interface StageMeta {
  name?: string;
  "q5.3.1"?: string;
  "q5.3.2"?: string;
  "q5.3.3"?: string;
  "q5.3.4.2"?: string[];
  "q5.3.4.3"?: string;
  sampleSize?: number;
  popSize?: number;
  stageNumber?: number;
  reportingAllocations?: number[];
  _built?: boolean;
  _reportingLevels?: ReportingLevel[];
  _stageStrata?: string[][];
}

// no longer tracking popsize, want to just use sample size to make it easier to bind to redux changes
// export interface TreeNodeAllocation {
//     popSize?: number,
//     sampleSize?: number
// }

export interface ProjectValues {
  "q1.1"?: string;
  "q1.2"?: string;
  "q1.3"?: string;
  "q2.1.1"?: string;
  "q2.1.2"?: string;
  "q2.2.1"?: string;
  "q2.2.2"?: string;
  // 2.2.2 (indicator specified value of s.d) needs float parse
  "q2.2.3"?: string;
  "q2.2.4"?: string;
  "q2.3.1"?: string;
  // 2.3.1 (indicator proportion) needs float parse
  "q3.1"?: string;
  "q3.2"?: string;
  "q3.3"?: string;
  "q3.4"?: string;
  "q3.5"?: string;
  "q4.1"?: string;
  "q4.3"?: string;
  "q5.1"?: string;
  "q5.1.1"?: string;
  "q5.2"?: string;
  "q5.3"?: StageMeta[];
  "q5.3.1"?: string;
  "q5.3.2"?: string;
  "q5.3.3"?: string;
  "q5.3.4.2"?: string;
  "q5.3.4.3"?: string;
  "q6.1"?: string;
  reportingLevels?: ReportingLevel[];
  samplingStages?: StageMeta[];
  _calculatorVars?: CalculatorVars;
  _allocation?: IAllocation;
}

export interface IAllocation {
  aggregationSampleSize: number;
  totalSampleSize: number;
  recommendedAggregationSize: number;
  recommendedTotalSampleSize: number;
}
