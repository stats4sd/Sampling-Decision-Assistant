import { CalculatorVars } from "../components/dataVis/sample-size-calculator/sample-size-calculator";

// models for how variables should be stored

export interface Project {
    title?: string,
    created: number,
    edited: number,
    values: ProjectValues,
    stagesComplete: boolean[],
    dbVersion: number,
    draft?: boolean
}

export type SavedProjects = Project[]

export interface AppState {
    activeProject?: Project,
    savedProjects?: Project[],
    editMode?: boolean,
    reviewMode?: boolean,
    view: ViewState
    _dbVersion?: number,
    _platforms?: string[],
    _treeMeta: TreeState;
}

export interface ViewState {
    params?: ViewStateParams,
    hash?: string,
    activeStageID?: string,
    lockHash?: string
}

export interface ViewStateParams {
    stagePart?: number,
    activeGlossaryTerm?: string,
    tabSection?: 'resources' | 'glossary',
    relevant?: string
}

export interface TreeState {
    activeNode?: TreeDiagramNode,
    nodes?: TreeDiagramNode[],
    infoSection?: 'info' | 'allocation'
}

export interface Question {
    isQuestion: string,
    controlName: string,
    repeatGroup?: string,
    type: string,
    selectOptions?: string,
    label: string,
    section: string,
    condition?: string,
    labelMultiple?: string,
    options?: any,
    triggers?: any,
    conditionJson?: any

}

export interface ReportingLevel {
    name: string,
    classifications: ReportingLevelClassification
}

export interface ReportingLevelClassification {
    names: string[],
    total?: string
}

export interface glossaryTerm {
    slug: string,
    definition: string,
    term: string
}

// tree diagram
export interface TreeDiagramNode {
    id?: string,
    label?: string,
    group?: string,
    title?: string[]
}
export interface ExtendedTreeDiagramNode extends TreeDiagramNode {
    reportingMeta?: any[],
    stageMeta?: StageMeta,
}

export interface TreeDiagramNodeColor {
    background: string,
    border: string,
    highlight: TreeDiagramNodeNodeColorHighlight
}

export interface TreeDiagramNodeNodeColorHighlight {
    background: string,
    border: string
}

// stage meta stored on samplingStages value
export interface StageMeta {
    name?: string,
    'q5.3.1'?: string,
    'q5.3.2'?: string,
    'q5.3.3'?: string,
    'q5.3.4.2'?: string[],
    'q5.3.4.3'?: string,
    sampleSize?: number,
    popSize?: number,
    stageNumber?: number,
    reportingAllocations?: number[]
    _built?: boolean
}

export interface TreeNodeAllocation {
    popSize?: number,
    sampleSize?: number
}

export interface ProjectValues {
    "q1.1"?: string,
    "q1.2"?: string,
    "q1.3"?: string,
    "q2.1.1"?: string,
    "q2.1.2"?: string,
    "q2.2.1"?: string,
    "q2.2.2"?: string,
    // 2.2.2 (indicator specified value of s.d) needs float parse 
    "q2.2.3"?: string,
    "q2.2.4"?: string,
    "q2.3.1"?: string,
    // 2.3.1 (indicator proportion) needs float parse 
    "q3.1"?: string,
    "q3.2"?: string,
    "q3.3"?: string,
    "q3.4"?: string,
    "q3.5"?: string,
    "q4.1"?: string,
    "q4.3"?: string,
    "q5.1"?: string,
    "q5.1.1"?: string,
    "q5.2"?: string,
    "q5.3"?: StageMeta[],
    "q5.3.1"?: string,
    "q5.3.2"?: string,
    "q5.3.3"?: string,
    "q5.3.4.2"?: string,
    "q5.3.4.3"?: string,
    "q6.1"?: string,
    reportingLevels?: ReportingLevel[],
    samplingStages?:StageMeta[],
    _calculatorVars?:CalculatorVars,
    allocation?:any
}